import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RequestInterceptor } from "@/lib/api/interceptor";
import { useCreateNetworkMutation } from "@/services/api";

const createNetworkSchema = z.object({
  name: z.string().min(1, "Network name is required"),
  description: z.string().optional(),
});

type CreateNetworkFormData = z.infer<typeof createNetworkSchema>;

interface CreateNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateNetworkModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateNetworkModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createNetwork] = useCreateNetworkMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateNetworkFormData>({
    resolver: zodResolver(createNetworkSchema),
  });

  const onSubmit = async (data: CreateNetworkFormData) => {
    setIsLoading(true);

    try {
      await RequestInterceptor.handleRequest(
        () => createNetwork(data).unwrap(),
        {
          onSuccess: () => {
            reset();
            onClose();
            onSuccess?.();
          },
          onError: (error) => {
            console.error("Network creation error:", error);
          },
          successMessage: "Network created successfully!",
          errorMessage: "Failed to create network. Please try again.",
          showToast: true,
        },
        "CREATE_NETWORK"
      );
    } catch (error) {
      console.error("Network creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md"
        >
          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-bold text-white">
                Create Network
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-space-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Network Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter network name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-space-400"
                    {...register("name")}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400"
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your network..."
                    className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder:text-space-400 resize-none"
                    {...register("description")}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 glass-card text-white border-white/20"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 cosmic"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Network"
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

export default CreateNetworkModal;
