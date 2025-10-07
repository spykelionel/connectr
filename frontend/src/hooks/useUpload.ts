import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useUploadSimpleMutation } from "../services/uploadApi";

export type UploadService = "profile" | "post" | "network" | "general";

interface UseUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
  showToast?: boolean;
}

interface UseUploadReturn {
  upload: (file: File, options?: { folder?: string }) => Promise<string | null>;
  uploadMultiple: (
    files: File[],
    options?: { folder?: string }
  ) => Promise<string[]>;
  isUploading: boolean;
  progress: number;
}

export const useUpload = (
  service: UploadService,
  options: UseUploadOptions = {}
): UseUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [uploadSimple] = useUploadSimpleMutation();

  const { onSuccess, onError, showToast = true } = options;

  const upload = useCallback(
    async (
      file: File,
      uploadOptions: { folder?: string } = {}
    ): Promise<string | null> => {
      if (!file) {
        const error = "No file provided";
        onError?.(error);
        if (showToast) toast.error(error);
        return null;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        const error = "Invalid file type. Only images are allowed.";
        onError?.(error);
        if (showToast) toast.error(error);
        return null;
      }

      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        const error = "File size too large. Maximum size is 50MB.";
        onError?.(error);
        if (showToast) toast.error(error);
        return null;
      }

      setIsUploading(true);
      setProgress(0);

      try {
        let result;

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        // Use simple upload for all file types
        const path = uploadOptions.folder || `${service}s`;
        result = await uploadSimple({ file, path }).unwrap();

        if (!result || !result.data?.secure_url) {
          throw new Error("Upload failed: No URL returned from server");
        }

        clearInterval(progressInterval);
        setProgress(100);

        const url = result.data.secure_url;
        onSuccess?.(url);

        if (showToast) {
          toast.success("File uploaded successfully!");
        }

        return url;
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || error?.message || "Upload failed";
        onError?.(errorMessage);

        if (showToast) {
          toast.error(`Upload failed: ${errorMessage}`);
        }

        return null;
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [service, uploadSimple, onSuccess, onError, showToast]
  );

  const uploadMultiple = useCallback(
    async (
      files: File[],
      uploadOptions: { folder?: string } = {}
    ): Promise<string[]> => {
      if (!files || files.length === 0) {
        const error = "No files provided";
        onError?.(error);
        if (showToast) toast.error(error);
        return [];
      }

      setIsUploading(true);
      setProgress(0);

      try {
        const uploadPromises = files.map((file) =>
          upload(file, {
            folder: uploadOptions.folder || `${service}s`,
          })
        );

        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter(
          (url): url is string => url !== null
        );

        if (showToast) {
          toast.success(
            `${successfulUploads.length}/${files.length} files uploaded successfully!`
          );
        }

        return successfulUploads;
      } catch (error: any) {
        const errorMessage = error?.message || "Multiple upload failed";
        onError?.(errorMessage);

        if (showToast) {
          toast.error(`Upload failed: ${errorMessage}`);
        }

        return [];
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [upload, service, onError, showToast]
  );

  return {
    upload,
    uploadMultiple,
    isUploading,
    progress,
  };
};
