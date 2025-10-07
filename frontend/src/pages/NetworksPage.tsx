import CreateNetworkModal from "@/components/networks/CreateNetworkModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";
import { useGetNetworksQuery } from "@/services/api";
import { motion } from "framer-motion";
import { Filter, Plus, Search, Users } from "lucide-react";
import { useState } from "react";

const NetworksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {
    data: networks = [],
    isLoading,
    error,
    refetch,
  } = useGetNetworksQuery();

  const filteredNetworks = networks.filter(
    (network) =>
      network.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      network.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <h1 className="text-3xl font-bold cosmic-text">Networks</h1>
              <p className="text-space-300 mt-2">
                Discover and join communities that match your interests
              </p>
            </div>
            <Button className="cosmic" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Network
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
                    placeholder="Search networks..."
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

        {/* Networks Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-space-300">Loading networks...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400">Error loading networks</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNetworks.map((network, index) => (
              <motion.div
                key={network.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/20 hover-lift h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-cosmic-600 text-white">
                          {getInitials(network.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">
                          {network.name}
                        </h3>
                        <p className="text-space-400 text-sm">
                          Created{" "}
                          {new Date(network.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-space-300 text-sm">
                      {network.description || "No description available"}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-space-400 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{network.memberships?.length || 0} members</span>
                      </div>
                      <Button size="sm" className="cosmic">
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <CreateNetworkModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default NetworksPage;
