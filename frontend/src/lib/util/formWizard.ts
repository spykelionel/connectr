/**
 * Form Utility for creating standardized request configurations
 */
export class FormWizard {
  /**
   * Creates a POST request configuration
   * @param {string} url The endpoint to post to
   * @param {any} body The body of the request
   * @returns {Partial<RequestInit & { url: string }>} Request options object
   */
  static post(
    url: string,
    body: any
  ): Partial<RequestInit & { url: string }> => ({
    url,
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * Creates a PATCH request configuration
   * @param {string} url The endpoint to patch
   * @param {any} body The body of the request
   * @returns {Partial<RequestInit & { url: string }>} Request options object
   */
  static patch(
    url: string,
    body: any
  ): Partial<RequestInit & { url: string }> => ({
    url,
    method: "PATCH",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * Creates a PUT request configuration
   * @param {string} url The endpoint to put
   * @param {any} body The body of the request
   * @returns {Partial<RequestInit & { url: string }>} Request options object
   */
  static put(
    url: string,
    body: any
  ): Partial<RequestInit & { url: string }> => ({
    url,
    method: "PUT",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * Creates a DELETE request configuration
   * @param {string} url The endpoint to delete
   * @returns {Partial<RequestInit & { url: string }>} Request options object
   */
  static delete(url: string): Partial<RequestInit & { url: string }> => ({
    url,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * Creates a GET request configuration
   * @param {string} url The endpoint to get
   * @returns {Partial<RequestInit & { url: string }>} Request options object
   */
  static get(url: string): Partial<RequestInit & { url: string }> => ({
    url,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * Creates a FormData POST request configuration
   * @param {string} url The endpoint to post to
   * @param {FormData} formData The form data to send
   * @returns {Partial<RequestInit & { url: string }>} Request options object
   */
  static postFormData(url: string, formData: FormData) {
    return {
      url,
      body: formData,
      method: "POST",
      formData: true,
    };
  }
}
