import FindPeopleModal from "@/components/connections/FindPeopleModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";
import {
  useGetConnectionsQuery,
  useGetFriendsQuery,
  useGetPendingConnectionsQuery,
  useUpdateConnectionStatusMutation,
} from "@/services/api";
import { motion } from "framer-motion";
import {
  Clock,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Search,
  UserCheck,
  UserMinus,
  UserPlus,
  UserX,
  Users,
} from "lucide-react";
import { useState } from "react";

const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "friends">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFindPeopleModal, setShowFindPeopleModal] = useState(false);

  const { data: allConnections = [], isLoading: isLoadingAll } =
    useGetConnectionsQuery(undefined);
  const { data: friends = [], isLoading: isLoadingFriends } =
    useGetFriendsQuery();
  const { data: pendingConnections = [], isLoading: isLoadingPending } =
    useGetPendingConnectionsQuery();

  const [updateConnectionStatus] = useUpdateConnectionStatusMutation();

  const getCurrentConnections = () => {
    switch (activeTab) {
      case "friends":
        return friends;
      case "pending":
        return pendingConnections;
      default:
        return allConnections;
    }
  };

  const currentConnections = getCurrentConnections();
  const isLoading = isLoadingAll || isLoadingFriends || isLoadingPending;

  const filteredConnections = currentConnections.filter(
    (connection) =>
      connection.friend?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      connection.friend?.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleAcceptConnection = async (connectionId: string) => {
    try {
      await updateConnectionStatus({
        id: connectionId,
        status: "accepted",
      }).unwrap();
    } catch (error) {
      console.error("Failed to accept connection:", error);
    }
  };

  const handleRejectConnection = async (connectionId: string) => {
    try {
      await updateConnectionStatus({
        id: connectionId,
        status: "blocked",
      }).unwrap();
    } catch (error) {
      console.error("Failed to reject connection:", error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white mb-2">
                Connections
              </h1>
              <p className="text-white/60">
                {currentConnections.length} connections in your network
              </p>
            </div>
            <Button
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => setShowFindPeopleModal(true)}
            >
              <UserPlus className="h-4 w-4" />
              Find People
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Search and Sort */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
            {[
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "friends", label: "Friends" },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                className={`flex-1 ${
                  activeTab === tab.key
                    ? "bg-blue-500 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                onClick={() =>
                  setActiveTab(tab.key as "all" | "pending" | "friends")
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Connections Grid */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-4" />
            <div className="text-white/60">Loading connections...</div>
          </motion.div>
        ) : filteredConnections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Users className="h-8 w-8 text-white/40" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {activeTab === "pending"
                ? "No pending requests"
                : activeTab === "friends"
                ? "No friends yet"
                : "No connections found"}
            </h3>
            <p className="text-white/60 mb-4">
              {activeTab === "pending"
                ? "All connection requests have been handled"
                : activeTab === "friends"
                ? "Start building your network by connecting with people"
                : "Try adjusting your search or connect with new people"}
            </p>
            <Button
              onClick={() => setShowFindPeopleModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Find People
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredConnections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
              >
                {/* Header with Avatar and Menu */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-500 text-white font-semibold">
                        {getInitials(connection.friend?.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                        {connection.friend?.name || "Unknown User"}
                      </h3>
                      <p className="text-sm text-white/60 truncate">
                        {connection.friend?.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  {connection.status === "accepted" ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                      <UserCheck className="h-3 w-3" />
                      Connected
                    </div>
                  ) : connection.status === "pending" ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                      <Clock className="h-3 w-3" />
                      Pending
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
                      <UserMinus className="h-3 w-3" />
                      {connection.status}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {connection.status === "accepted" ? (
                    <>
                      <Button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        className="px-3 py-2 bg-white/5 text-white border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                      >
                        View
                      </Button>
                    </>
                  ) : connection.status === "pending" ? (
                    <>
                      <Button
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                        onClick={() => handleAcceptConnection(connection.id)}
                      >
                        <UserCheck className="h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="px-3 py-2 bg-red-500/20 text-red-400 border-red-500/30 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                        onClick={() => handleRejectConnection(connection.id)}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1 px-3 py-2 bg-white/5 text-white border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      Blocked
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <FindPeopleModal
        isOpen={showFindPeopleModal}
        onClose={() => setShowFindPeopleModal(false)}
        onSuccess={() => {
          // Refresh connections data
          window.location.reload();
        }}
      />
    </div>
  );
};

export default ConnectionsPage;
