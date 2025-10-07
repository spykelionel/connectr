import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";
import { motion } from "framer-motion";
import { Filter, Search, UserCheck, UserPlus, UserX } from "lucide-react";

const ConnectionsPage = () => {
  const connections = [
    {
      id: "1",
      name: "Alex Johnson",
      role: "Software Engineer",
      status: "accepted",
      mutualConnections: 12,
      avatar: "",
    },
    {
      id: "2",
      name: "Sarah Chen",
      role: "UX Designer",
      status: "pending",
      mutualConnections: 8,
      avatar: "",
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      role: "Product Manager",
      status: "accepted",
      mutualConnections: 15,
      avatar: "",
    },
    {
      id: "4",
      name: "Emma Wilson",
      role: "Marketing Director",
      status: "accepted",
      mutualConnections: 6,
      avatar: "",
    },
  ];

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
            <Button className="cosmic">
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
            {["All", "Pending", "Suggestions"].map((tab, index) => (
              <Button
                key={tab}
                variant={index === 0 ? "default" : "ghost"}
                className={`flex-1 ${
                  index === 0
                    ? "cosmic"
                    : "text-space-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection, index) => (
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
                        {getInitials(connection.name)}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="text-white font-semibold text-lg">
                      {connection.name}
                    </h3>
                    <p className="text-space-400 text-sm mb-2">
                      {connection.role}
                    </p>
                    <p className="text-space-500 text-xs mb-4">
                      {connection.mutualConnections} mutual connections
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
                      ) : (
                        <>
                          <Button size="sm" className="flex-1 cosmic">
                            <UserCheck className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="glass-card text-white border-white/20"
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;
