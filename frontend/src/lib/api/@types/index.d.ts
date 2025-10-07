interface IRequestOptions {
  confirmMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  shouldConfirm?: boolean;
  showToast?: boolean;
}

interface IRequestResponse {
  message: string;
  success: boolean;
  data: any;
}

interface IResponse {
  message: string;
  success: boolean;
  tag: string;
  data?: any;
}
