import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Globe,
  Image,
  Loader2,
  Send,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpload } from "@/hooks/useUpload";
import { RequestInterceptor } from "@/lib/api/interceptor";
import { useCreatePostMutation, useGetUserNetworksQuery } from "@/services/api";
import { RootState } from "@/store";

const createPostSchema = z.object({
  body: z.string().min(1, "Post content is required"),
  networkId: z.string().optional(),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreatePostModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreatePostModalProps) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const [createPost] = useCreatePostMutation();
  const { data: userNetworks = [] } = useGetUserNetworksQuery(user?.id || "");

  const { upload, progress } = useUpload("post", {
    onSuccess: (url) => {
      setUploadedUrls((prev) => [...prev, url]);
    },
    onError: (error) => {
      console.error("Upload error:", error);
    },
    showToast: false, // We'll handle toast manually
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      networkId: "",
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      setSelectedImages((prev) => [...prev, ...imageFiles]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) return [];

    setIsUploadingImages(true);
    const urls: string[] = [];

    try {
      for (const image of selectedImages) {
        const url = await upload(image);
        if (url) {
          urls.push(url);
        } else {
          // If any upload fails, throw an error to stop the process
          throw new Error(`Failed to upload image: ${image.name}`);
        }
      }
      return urls;
    } catch (error) {
      // If upload fails, clear any partial uploads and rethrow
      setUploadedUrls([]);
      throw error;
    } finally {
      setIsUploadingImages(false);
    }
  };

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      // Upload images first - if this fails, don't create the post
      const imageUrls = await uploadImages();

      const result = await RequestInterceptor.handleRequest(
        async () => {
          const post = await createPost({
            body: data.body,
            attachment: imageUrls.length > 0 ? imageUrls[0] : undefined, // Backend expects single attachment
            networkId: data.networkId || undefined,
          }).unwrap();

          return {
            message: "Post created successfully",
            success: true,
            data: post,
          };
        },
        {
          onSuccess: () => {
            reset();
            setSelectedImages([]);
            setUploadedUrls([]);
            onSuccess?.();
            onClose();
          },
          onError: (error) => {
            console.error("Post creation error:", error);
          },
          successMessage: "Post created successfully!",
          errorMessage: "Failed to create post. Please try again.",
          showToast: true,
        },
        "CREATE_POST"
      );

      if (result.success) {
        // Additional success handling if needed
      }
    } catch (error) {
      console.error("Post creation failed:", error);
      // Don't reset form or close modal on upload failure
      // Let user retry or fix the issue
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isUploadingImages) {
      reset();
      setSelectedImages([]);
      setUploadedUrls([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-semibold text-white">
                Create New Post
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                disabled={isSubmitting || isUploadingImages}
                className="text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Network Selection */}
                {userNetworks.length > 0 && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="networkId"
                      className="text-white flex items-center"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Post to Network (Optional)
                    </Label>
                    <select
                      {...register("networkId")}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-space-400 focus:border-cosmic-400 focus:outline-none"
                    >
                      <option value="">Personal Timeline</option>
                      {userNetworks.map((network) => (
                        <option key={network.id} value={network.id}>
                          {network.name}
                        </option>
                      ))}
                    </select>
                    {errors.networkId && (
                      <p className="text-sm text-red-400">
                        {errors.networkId.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Post Content */}
                <div className="space-y-2">
                  <Label htmlFor="body" className="text-white">
                    What's on your mind?
                  </Label>
                  <Textarea
                    {...register("body")}
                    placeholder="Share your thoughts..."
                    className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-space-400 focus:border-cosmic-400 resize-none"
                  />
                  {errors.body && (
                    <p className="text-sm text-red-400">
                      {errors.body.message}
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white flex items-center">
                      <Image className="w-4 h-4 mr-2" />
                      Add Photos
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImages}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Images
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {/* Selected Images Preview */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {uploadedUrls[index] && (
                            <div className="absolute bottom-2 left-2">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Progress */}
                  {isUploadingImages && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-cosmic-400" />
                        <span className="text-sm text-white">
                          Uploading images...
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-cosmic-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting || isUploadingImages}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isUploadingImages}
                    className="cosmic"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Create Post
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreatePostModal;
