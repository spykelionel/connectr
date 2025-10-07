import FindPeopleModal from "@/components/connections/FindPeopleModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";
import {
  useCreateConnectionMutation,
  useGetConnectionsQuery,
  useGetFriendsQuery,
  useGetPendingConnectionsQuery,
  useUpdateConnectionStatusMutation,
} from "@/services/api";
import { motion } from "framer-motion";
import { Filter, Search, UserCheck, UserPlus, UserX } from "lucide-react";
import { useState } from "react";

const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "friends">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFindPeopleModal, setShowFindPeopleModal] = useState(false);

  const { data: allConnections = [], isLoading: isLoadingAll } =
    useGetConnectionsQuery();
  const { data: friends = [], isLoading: isLoadingFriends } =
    useGetFriendsQuery();
  const { data: pendingConnections = [], isLoading: isLoadingPending } =
    useGetPendingConnectionsQuery();

  const [updateConnectionStatus] = useUpdateConnectionStatusMutation();
  const [createConnection] = useCreateConnectionMutation();

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
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold cosmic-text">Connections</h1>
              <p className="text-space-300 mt-2">
                Manage your professional network and discover new connections
              </p>
            </div>
            <Button
              className="cosmic"
              onClick={() => setShowFindPeopleModal(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Find People
            </Button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-space-400" />
                  <Input
                    placeholder="Search connections..."
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-space-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="glass-card text-white border-white/20"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
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
                    ? "cosmic"
                    : "text-space-300 hover:text-white hover:bg-white/10"
                }`}
                onClick={() =>
                  setActiveTab(tab.key as "all" | "pending" | "friends")
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Connections Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-space-300">Loading connections...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/20 hover-lift h-full">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <AvatarFallback className="bg-cosmic-600 text-white text-xl">
                          {getInitials(connection.friend?.name || "U")}
                        </AvatarFallback>
                      </Avatar>

                      <h3 className="text-white font-semibold text-lg">
                        {connection.friend?.name || "Unknown User"}
                      </h3>
                      <p className="text-space-400 text-sm mb-2">
                        {connection.friend?.email}
                      </p>
                      <p className="text-space-500 text-xs mb-4">
                        Status: {connection.status}
                      </p>

                      <div className="flex space-x-2">
                        {connection.status === "accepted" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 glass-card text-white border-white/20"
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Connected
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="glass-card text-white border-white/20"
                            >
                              Message
                            </Button>
                          </>
                        ) : connection.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              className="flex-1 cosmic"
                              onClick={() =>
                                handleAcceptConnection(connection.id)
                              }
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="glass-card text-white border-white/20"
                              onClick={() =>
                                handleRejectConnection(connection.id)
                              }
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 glass-card text-white border-white/20"
                          >
                            Blocked
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
          window.location.reload(); // Simple refresh for now
        }}
      />
    </div>
  );
};

export default ConnectionsPage;
