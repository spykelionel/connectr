import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

// Upload types
export interface UploadFileDto {
  uploadType: "profile" | "post" | "network" | "general";
  folder?: string;
  tags?: string[];
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: "jpg" | "jpeg" | "png" | "webp" | "gif";
  };
}

export interface UploadResponseDto {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  created_at: string;
  uploadType: string;
  folder?: string;
  tags?: string[];
}

export interface BulkUploadResponseDto {
  successful: UploadResponseDto[];
  failed: Array<{
    filename: string;
    error: string;
  }>;
  total: number;
  successCount: number;
  failureCount: number;
}

export interface DeleteResponseDto {
  result: string;
  message: string;
}

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Upload"],
  endpoints: (builder) => ({
    // Simple upload - Main upload method for all file types
    uploadSimple: builder.mutation<
      UploadResponseDto,
      { file: File; path?: string }
    >({
      query: ({ file, path }) => {
        const formData = new FormData();
        formData.append("file", file);
        if (path) {
          formData.append("path", path);
        }
        console.log(formData);

        return {
          url: "upload/simple",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Upload"],
    }),

    // Single file upload
    uploadSingle: builder.mutation<
      UploadResponseDto,
      { file: File; uploadDto: UploadFileDto }
    >({
      query: ({ file, uploadDto }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploadType", uploadDto.uploadType);
        if (uploadDto.folder) formData.append("folder", uploadDto.folder);
        if (uploadDto.tags)
          formData.append("tags", JSON.stringify(uploadDto.tags));
        if (uploadDto.transformation)
          formData.append(
            "transformation",
            JSON.stringify(uploadDto.transformation)
          );

        return {
          url: "upload/single",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Upload"],
    }),

    // Profile image upload
    uploadProfile: builder.mutation<
      UploadResponseDto,
      { file: File; uploadDto?: Partial<UploadFileDto> }
    >({
      query: ({ file, uploadDto = {} }) => {
        const formData = new FormData();
        formData.append("file", file);
        // Profile endpoint automatically sets uploadType to 'profile'
        if (uploadDto.folder) formData.append("folder", uploadDto.folder);
        if (uploadDto.tags)
          formData.append("tags", JSON.stringify(uploadDto.tags));
        if (uploadDto.transformation)
          formData.append(
            "transformation",
            JSON.stringify(uploadDto.transformation)
          );

        return {
          url: "upload/profile",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Upload"],
    }),

    // Post image upload
    uploadPost: builder.mutation<
      UploadResponseDto,
      { file: File; uploadDto?: Partial<UploadFileDto> }
    >({
      query: ({ file, uploadDto = {} }) => {
        const formData = new FormData();
        formData.append("file", file);
        // Post endpoint automatically sets uploadType to 'post'
        if (uploadDto.folder) formData.append("folder", uploadDto.folder);
        if (uploadDto.tags)
          formData.append("tags", JSON.stringify(uploadDto.tags));
        if (uploadDto.transformation)
          formData.append(
            "transformation",
            JSON.stringify(uploadDto.transformation)
          );

        return {
          url: "upload/post",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Upload"],
    }),

    // Network avatar upload
    uploadNetwork: builder.mutation<
      UploadResponseDto,
      { file: File; uploadDto?: Partial<UploadFileDto> }
    >({
      query: ({ file, uploadDto = {} }) => {
        const formData = new FormData();
        formData.append("file", file);
        // Network endpoint automatically sets uploadType to 'network'
        if (uploadDto.folder) formData.append("folder", uploadDto.folder);
        if (uploadDto.tags)
          formData.append("tags", JSON.stringify(uploadDto.tags));
        if (uploadDto.transformation)
          formData.append(
            "transformation",
            JSON.stringify(uploadDto.transformation)
          );

        return {
          url: "upload/network",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Upload"],
    }),

    // Multiple files upload
    uploadMultiple: builder.mutation<
      BulkUploadResponseDto,
      { files: File[]; uploadDto: UploadFileDto }
    >({
      query: ({ files, uploadDto }) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("uploadType", uploadDto.uploadType);
        if (uploadDto.folder) formData.append("folder", uploadDto.folder);
        if (uploadDto.tags)
          formData.append("tags", JSON.stringify(uploadDto.tags));
        if (uploadDto.transformation)
          formData.append(
            "transformation",
            JSON.stringify(uploadDto.transformation)
          );

        return {
          url: "upload/multiple",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Upload"],
    }),

    // Delete file
    deleteFile: builder.mutation<DeleteResponseDto, string>({
      query: (publicId) => ({
        url: `upload/${publicId}`,
        method: "DELETE",
        formData: true,
      }),
      invalidatesTags: ["Upload"],
    }),

    // Delete multiple files
    deleteMultipleFiles: builder.mutation<
      {
        successful: Array<{
          publicId: string;
          result: string;
          message: string;
        }>;
        failed: Array<{ publicId: string; error: string }>;
        total: number;
        successCount: number;
        failureCount: number;
      },
      { publicIds: string[] }
    >({
      query: ({ publicIds }) => ({
        url: "upload/delete-multiple",
        method: "POST",
        body: { publicIds },
        formData: true,
      }),
      invalidatesTags: ["Upload"],
    }),

    // Upload from URL
    uploadFromUrl: builder.mutation<
      UploadResponseDto,
      { imageUrl: string; uploadDto?: Partial<UploadFileDto> }
    >({
      query: ({ imageUrl, uploadDto = {} }) => ({
        url: "upload/from-url",
        method: "POST",
        body: { imageUrl, ...uploadDto },
        formData: true,
      }),
      invalidatesTags: ["Upload"],
    }),

    // Get file info
    getFileInfo: builder.query<UploadResponseDto, string>({
      query: (publicId) => ({
        url: `upload/info/${publicId}`,
        formData: true,
      }),
      providesTags: ["Upload"],
    }),
  }),
});

export const {
  useUploadSimpleMutation,
  useUploadSingleMutation,
  useUploadProfileMutation,
  useUploadPostMutation,
  useUploadNetworkMutation,
  useUploadMultipleMutation,
  useDeleteFileMutation,
  useDeleteMultipleFilesMutation,
  useUploadFromUrlMutation,
  useGetFileInfoQuery,
} = uploadApi;
