"use client";

import type React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bold,
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  Globe,
  Hash,
  Heart,
  ImageIcon,
  Italic,
  Link2,
  List,
  Loader2,
  MoreHorizontal,
  Quote,
  Sparkles,
  Type,
  Upload,
  Users,
  Video,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RequestInterceptor } from "@/lib/api/interceptor";
import { getInitials } from "@/lib/utils";
import { useCreatePostMutation, useGetUserNetworksQuery } from "@/services/api";
import { useUploadSimpleMutation } from "@/services/uploadApi";
import type { RootState } from "@/store";

const createPostSchema = z.object({
  body: z
    .string()
    .min(1, "Post content is required")
    .max(2000, "Post is too long (max 2000 characters)"),
  networkId: z.string().optional(),
  visibility: z.enum(["public", "network", "friends"]).default("public"),
  scheduledAt: z.string().optional(),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreatePostModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreatePostModalProps) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const [createPost] = useCreatePostMutation();
  const [uploadSimple] = useUploadSimpleMutation();
  const { data: userNetworks = [] } = useGetUserNetworksQuery(user?.id || "");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      networkId: "",
      visibility: "public",
    },
  });

  const watchedBody = watch("body", "");
  const watchedVisibility = watch("visibility", "public");

  // Character count and typing indicator
  useEffect(() => {
    setCharacterCount(watchedBody.length);

    if (watchedBody.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [watchedBody]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length > 0) {
        setSelectedImages((prev) => [...prev, ...imageFiles]);
      }
    }
  }, []);

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
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];

        const progressPercent = ((i + 1) / selectedImages.length) * 100;
        setUploadProgress(progressPercent);

        const result = await uploadSimple({
          file: image,
          path: "posts",
        }).unwrap();

        if (result.success && result.data?.secure_url) {
          urls.push(result.data.secure_url);
          setUploadedUrls((prev) => [...prev, result.data.secure_url]);
        } else {
          throw new Error(`Failed to upload image: ${image.name}`);
        }
      }
      return urls;
    } catch (error) {
      setUploadedUrls([]);
      throw error;
    } finally {
      setIsUploadingImages(false);
    }
  };

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      const imageUrls = await uploadImages();

      const result = await RequestInterceptor.handleRequest(
        async () => {
          const post = await createPost({
            body: data.body,
            attachment: imageUrls.length > 0 ? imageUrls[0] : undefined,
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
            setShowAdvanced(false);
            onSuccess?.();
            onClose();
          },
          onError: (error) => {
            console.error("Post creation error:", error);
          },
          successMessage: "Post created successfully! 🎉",
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
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isUploadingImages) {
      reset();
      setSelectedImages([]);
      setUploadedUrls([]);
      setShowAdvanced(false);
      onClose();
    }
  };

  const formatText = (format: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = watchedBody.substring(start, end);

      let formattedText = "";
      switch (format) {
        case "bold":
          formattedText = `**${selectedText}**`;
          break;
        case "italic":
          formattedText = `*${selectedText}*`;
          break;
        case "quote":
          formattedText = `> ${selectedText}`;
          break;
        case "list":
          formattedText = `- ${selectedText}`;
          break;
        default:
          formattedText = selectedText;
      }

      const newText =
        watchedBody.substring(0, start) +
        formattedText +
        watchedBody.substring(end);
      setValue("body", newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + formattedText.length,
          start + formattedText.length
        );
      }, 0);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="w-full max-w-3xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileurl} />
                    <AvatarFallback className="bg-blue-500 text-white text-sm">
                      {getInitials(user?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold text-white">
                      Create Post
                    </CardTitle>
                    <p className="text-xs text-gray-400">
                      Share with{" "}
                      {watchedVisibility === "public"
                        ? "everyone"
                        : watchedVisibility === "network"
                        ? "your network"
                        : "friends only"}
                    </p>
                  </div>
                </div>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 text-blue-400"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200" />
                  </motion.div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                disabled={isSubmitting || isUploadingImages}
                className="text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Network Selection */}
                {userNetworks.length > 0 && (
                  <div className="space-y-3">
                    <Label
                      htmlFor="networkId"
                      className="text-sm font-medium text-gray-300 flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      Post to Network
                    </Label>
                    <select
                      {...register("networkId")}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                    >
                      <option value="" className="bg-gray-800">
                        Personal Timeline
                      </option>
                      {userNetworks.map((network) => (
                        <option
                          key={network.id}
                          value={network.id}
                          className="bg-gray-800"
                        >
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="body"
                      className="text-sm font-medium text-gray-300"
                    >
                      What's on your mind?
                    </Label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs ${
                          characterCount > 1800
                            ? "text-red-400"
                            : characterCount > 1500
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      >
                        {characterCount}/2000
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFormatting(!showFormatting)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Type className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Formatting Toolbar */}
                  {showFormatting && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1 p-2 bg-gray-800 rounded-lg border border-gray-600"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => formatText("bold")}
                        className="text-gray-400 hover:text-white"
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => formatText("italic")}
                        className="text-gray-400 hover:text-white"
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => formatText("quote")}
                        className="text-gray-400 hover:text-white"
                      >
                        <Quote className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => formatText("list")}
                        className="text-gray-400 hover:text-white"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}

                  <Textarea
                    {...register("body")}
                    ref={textareaRef}
                    placeholder="Share your thoughts with the network..."
                    className="min-h-[160px] bg-gray-800 border border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-sm leading-relaxed transition-colors"
                  />
                  {errors.body && (
                    <p className="text-sm text-red-400">
                      {errors.body.message}
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div
                  className="space-y-4"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Media
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImages}
                        className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-blue-500 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Add Images
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Video
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <Link2 className="w-4 h-4 mr-2" />
                        Link
                      </Button>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {/* Drag and Drop Area */}
                  {selectedImages.length === 0 && !dragActive && (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <p className="text-gray-400">
                          Drag and drop images here
                        </p>
                        <p className="text-xs text-gray-500">
                          or click to browse
                        </p>
                      </div>
                    </div>
                  )}

                  {dragActive && (
                    <div className="border-2 border-dashed border-blue-500 rounded-lg p-8 text-center bg-blue-500/10">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-blue-400" />
                        <p className="text-blue-400">Drop images here</p>
                      </div>
                    </div>
                  )}

                  {/* Selected Images Preview */}
                  {selectedImages.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid grid-cols-2 gap-3"
                    >
                      {selectedImages.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group rounded-lg overflow-hidden border border-gray-600"
                        >
                          <img
                            src={
                              URL.createObjectURL(image) || "/placeholder.svg"
                            }
                            alt={`Preview ${index + 1}`}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {uploadedUrls[index] && (
                            <div className="absolute bottom-2 left-2 bg-green-500 rounded-full p-1">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Upload Progress */}
                  {isUploadingImages && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3 p-4 bg-gray-800 border border-gray-600 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        <span className="text-sm text-gray-300">
                          Uploading images... {Math.round(uploadProgress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="bg-blue-500 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Advanced Options */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-gray-400 hover:text-white flex items-center gap-2"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    Advanced Options
                    {showAdvanced ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>

                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-600"
                    >
                      {/* Visibility Settings */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-300">
                          Post Visibility
                        </Label>
                        <div className="flex gap-2">
                          {[
                            { value: "public", label: "Public", icon: Globe },
                            { value: "network", label: "Network", icon: Users },
                            { value: "friends", label: "Friends", icon: Heart },
                          ].map(({ value, label, icon: Icon }) => (
                            <Button
                              key={value}
                              type="button"
                              variant={
                                watchedVisibility === value
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                setValue("visibility", value as any)
                              }
                              className={`flex items-center gap-2 ${
                                watchedVisibility === value
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              {label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Scheduled Post */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="scheduledAt"
                          className="text-sm font-medium text-gray-300 flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Schedule Post (Optional)
                        </Label>
                        <input
                          {...register("scheduledAt")}
                          type="datetime-local"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Hash className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isSubmitting || isUploadingImages}
                      className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        isUploadingImages ||
                        characterCount === 0
                      }
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-200 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Create Post
                        </>
                      )}
                    </Button>
                  </div>
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
