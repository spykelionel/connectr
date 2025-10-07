import { useUpload } from "../hooks/useUpload";

// Example usage in different components:

// 1. Profile Image Upload Component
export const ProfileImageUpload = () => {
  const { upload, isUploading, progress } = useUpload("profile", {
    onSuccess: (url) => {
      console.log("Profile image uploaded:", url);
      // Update user profile with new image URL
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
    showToast: true,
  });

  const handleFileSelect = async (file: File) => {
    const url = await upload(file, {
      folder: "user-profiles",
      tags: ["avatar", "profile"],
      transformation: {
        width: 300,
        height: 300,
        crop: "fill",
        quality: "auto",
        format: "jpg",
      },
    });

    if (url) {
      // Handle successful upload
      console.log("Profile image URL:", url);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        disabled={isUploading}
      />
      {isUploading && (
        <div>
          <p>Uploading... {progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Network Avatar Upload Component
export const NetworkAvatarUpload = () => {
  const { upload, isUploading } = useUpload("network", {
    onSuccess: (url) => {
      console.log("Network avatar uploaded:", url);
    },
  });

  const handleUpload = async (file: File) => {
    const url = await upload(file, {
      folder: "network-avatars",
      tags: ["network", "avatar"],
    });

    return url;
  };

  return <div>{/* Network avatar upload UI */}</div>;
};

// 3. Multiple Images Upload for Posts
export const PostImageUpload = () => {
  const { uploadMultiple, isUploading } = useUpload("post", {
    onSuccess: (urls) => {
      console.log("Images uploaded:", urls);
    },
  });

  const handleMultipleUpload = async (files: File[]) => {
    const urls = await uploadMultiple(files, {
      folder: "post-images",
      tags: ["post", "content"],
    });

    return urls;
  };

  return <div>{/* Multiple image upload UI */}</div>;
};

// 4. General File Upload
export const GeneralFileUpload = () => {
  const { upload } = useUpload("general", {
    onSuccess: (url) => {
      console.log("File uploaded:", url);
    },
  });

  const handleUpload = async (file: File) => {
    const url = await upload(file, {
      folder: "general-uploads",
      tags: ["document", "file"],
    });

    return url;
  };

  return <div>{/* General file upload UI */}</div>;
};
