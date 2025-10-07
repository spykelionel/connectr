import toast from "react-hot-toast";

/**
 * Custom error class for handling ResponseInterceptor-specific errors.
 */
export class ResponseInterceptorError extends Error {
  /**
   * Creates an instance of ResponseInterceptorError.
   * @param {string} message - The error message.
   */
  constructor(message: string) {
    super(message);
    this.name = "ResponseInterceptorError";
  }
}

/**
 * ResponseInterceptor is responsible for handling a response object and
 * ensuring that its methods are not called until the response is applied
 * using the `apply()` method.
 */
export class ResponseInterceptor {
  /**
   * Private flag to track whether the `apply()` method has been called.
   * @private
   * @type {boolean}
   */
  private isApplied: boolean = false;

  data!: any;
  message!: string;
  success!: boolean;
  tag: string;

  /**
   * Creates an instance of ResponseInterceptor.
   * @param {string} [tag="Interceptor"] - An optional tag for logging purposes.
   */
  constructor(tag: string = "Interceptor") {
    this.tag = tag;
  }

  /**
   * Applies the response data to the interceptor.
   * This method must be called before using other methods.
   *
   * @param {IRequestResponse} response - The response object containing data.
   */
  apply(response: IRequestResponse) {
    const { data, message, success } = response;
    this.data = data;
    this.message = message;
    this.success = success;
    this.isApplied = true;
  }

  /**
   * Checks if the `apply()` method has been called.
   * Throws an error if `apply()` has not been invoked.
   *
   * @private
   * @throws {ResponseInterceptorError} Throws an error if `apply()` is not called before using other methods.
   */
  private _checkIfApplied() {
    if (!this.isApplied) {
      throw new ResponseInterceptorError(
        "apply() must be called before using this method."
      );
    }
  }

  /**
   * Alerts the consumer with the message from the response.
   * This method can only be called after `apply()` is invoked.
   *
   * @throws {ResponseInterceptorError} Throws an error if `apply()` is not called first.
   */
  alertConsumer() {
    this._checkIfApplied();
    alert(this.message);
  }

  /**
   * Logs the message to the console and shows an alert.
   * This method can only be called after `apply()` is invoked.
   *
   * @throws {ResponseInterceptorError} Throws an error if `apply()` is not called first.
   */
  logAndAlert() {
    this._checkIfApplied();
    console.log(`${this.tag}: ${this.message}`);
    alert(`${this.tag}: ${this.message}`);
  }

  /**
   * Logs the message to the console.
   * This method can only be called after `apply()` is invoked.
   *
   * @throws {ResponseInterceptorError} Throws an error if `apply()` is not called first.
   */
  log() {
    this._checkIfApplied();
    console.log(`${this.tag}: ${this.message}`);
  }
}

/**
 * RequestInterceptor class to handle common request patterns for creating, updating,
 * and deleting resources, while managing responses and errors consistently.
 */
export class RequestInterceptor {
  /**
   * Handles requests such as create, update, or delete operations.
   * This method wraps the request in try-catch logic and provides support
   * for confirmation dialogs, success/error messages, and callbacks.
   *
   * @param {() => Promise<IRequestResponse>} request - The request function that returns a promise (e.g., an API call).
   * @param {IRequestOptions} [options={}] - Configuration options for the request handling.
   * @param {string} [tag="REQUEST"] - An optional tag for logging purposes.
   *
   * @returns {Promise<IResponse>} Resolves when the request is completed.
   */
  static async handleRequest(
    request: () => Promise<IRequestResponse>,
    options: IRequestOptions = {},
    tag: string = "REQUEST"
  ): Promise<IResponse> {
    const {
      confirmMessage,
      successMessage,
      errorMessage,
      onSuccess,
      onError,
      showToast = true,
      shouldConfirm = false,
    } = options;

    try {
      // Optionally confirm the action (for delete or sensitive actions)
      if (shouldConfirm) {
        const hasConfirmed = confirm(
          confirmMessage || `Are you sure you want to ${tag}?`
        );
        if (!hasConfirmed) {
          return { message: "Action cancelled", success: false, tag };
        }
      }

      // Execute the request and handle the response
      const { message, success, data } = await request();
      console.log(message, success);

      // Optional success callback
      if (onSuccess && success) {
        onSuccess();
      }

      console.debug(`${tag}: ${message}`);
      showToast && toastMessage(success, successMessage ?? message);
      return { message, success, tag, data };
    } catch (error: any) {
      console.error(`${tag}:`, error);

      // Optional error callback
      if (onError) {
        onError(error);
      }

      function constructErrorMessage(error: any): string {
        if (error.data?.errors) {
          const errorMessages = Object.entries(error.data.errors)
            .map(([field, messages]) =>
              Array.isArray(messages)
                ? messages.map((msg: string) => `${field}: ${msg}`).join("; ")
                : `${field}: ${messages}`
            )
            .join("; ");

          return errorMessages || "Validation error";
        }
        if (error.error) {
          return error.error;
        }

        if (error.data?.message) {
          return error.data.message;
        }
        return "Something went wrong";
      }

      showToast &&
        toastMessage(false, errorMessage ?? constructErrorMessage(error));
      return {
        message: errorMessage ?? constructErrorMessage(error),
        success: false,
        tag,
      };
    }
  }
}

function toastMessage(success: boolean, message: string): void {
  if (success) {
    toast.success(message, {
      duration: 3000,
      position: "top-right",
    });
  } else {
    toast.error(message, {
      duration: 4000,
      position: "top-center",
    });
  }
}
