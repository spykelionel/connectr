import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";
import {
  useCreateConnectionMutation,
  useSearchUsersQuery,
} from "@/services/api";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, UserPlus, X } from "lucide-react";
import { useState } from "react";

interface FindPeopleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FindPeopleModal = ({
  isOpen,
  onClose,
  onSuccess,
}: FindPeopleModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [createConnection] = useCreateConnectionMutation();

  const {
    data: users = [],
    isLoading,
    error,
  } = useSearchUsersQuery(searchQuery, {
    skip: searchQuery.length < 2, // Only search when user types at least 2 characters
  });

  // Ensure users is always an array
  const safeUsers = Array.isArray(users) ? users : [];

  const handleConnect = async (userId: string) => {
    try {
      await createConnection({ friendId: userId }).unwrap();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create connection:", error);
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
          className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden"
        >
          <Card className="glass-card border-white/20 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-bold text-white">
                Find People
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

            <CardContent className="flex-1 overflow-hidden flex flex-col">
              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-space-400" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-space-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto">
                {searchQuery.length < 2 ? (
                  <div className="text-center py-12">
                    <div className="text-space-300">
                      Type at least 2 characters to search for people
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-space-300 mb-2" />
                    <div className="text-space-300">Searching...</div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="text-red-400">Error searching users</div>
                  </div>
                ) : safeUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-space-300">No users found</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {safeUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-cosmic-600 text-white">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">
                            {user.name}
                          </h4>
                          <p className="text-space-400 text-sm">{user.email}</p>
                          {user.contact && (
                            <p className="text-space-500 text-xs">
                              {user.contact}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="cosmic"
                          onClick={() => handleConnect(user.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FindPeopleModal;
