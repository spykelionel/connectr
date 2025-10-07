import CreateNetworkModal from "@/components/networks/CreateNetworkModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetNetworksQuery } from "@/services/api";
import { RootState } from "@/store";
import { motion } from "framer-motion";
import {
  Crown,
  Globe,
  Plus,
  Search,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const categories = [
  "All Networks",
  "Technology",
  "Creative",
  "Business",
  "Science",
  "Entertainment",
  "Sports",
  "Education",
];

const NetworksPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Networks");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data: networks = [],
    isLoading,
    error,
    refetch,
  } = useGetNetworksQuery();

  // Helper function to check if user is admin/creator of network
  const isUserAdmin = (network: any) => {
    return network.administrations?.some(
      (admin: any) => admin.userId === user?.id
    );
  };

  // Helper function to check if user is member of network
  const isUserMember = (network: any) => {
    return network.memberships?.some(
      (member: any) => member.userId === user?.id
    );
  };

  const filteredNetworks = networks.filter((network) => {
    const matchesSearch = network.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white mb-2">
                Networks
              </h1>
              <p className="text-white/60">
                Discover and join communities that match your interests
              </p>
            </div>
            <Button
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4" />
              Create Network
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Categories */}
        <aside className="w-64 border-r border-white/10 bg-black/50 min-h-screen p-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-white/60 mb-3 px-3">
              Categories
            </h3>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search networks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* Networks Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-white/60">Loading networks...</div>
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
                  className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
                >
                  {/* Network Image */}
                  <div className="relative h-40 overflow-hidden bg-white/10">
                    <div className="w-full h-full flex items-center justify-center">
                      <Globe className="h-16 w-16 text-white/40" />
                    </div>
                  </div>

                  {/* Network Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {network.name}
                      </h3>
                      <Globe className="h-4 w-4 text-white/60 flex-shrink-0" />
                    </div>

                    <p className="text-sm text-white/60 mb-4 line-clamp-2">
                      {network.description || "No description available"}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm text-white/60">
                        <Users className="h-4 w-4" />
                        <span>{network.memberships?.length || 0} members</span>
                      </div>

                      {/* Dynamic button based on user status */}
                      {isUserAdmin(network) ? (
                        <Button
                          variant="outline"
                          className="px-4 py-1.5 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 transition-colors flex items-center gap-1"
                        >
                          <Crown className="h-3 w-3" />
                          Admin
                        </Button>
                      ) : isUserMember(network) ? (
                        <Button
                          variant="outline"
                          className="px-4 py-1.5 border-green-500/50 text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-1"
                        >
                          <UserCheck className="h-3 w-3" />
                          Joined
                        </Button>
                      ) : (
                        <Button className="px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1">
                          <UserPlus className="h-3 w-3" />
                          Join
                        </Button>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10">
                      <span className="text-xs text-white/60">
                        Created{" "}
                        {new Date(network.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredNetworks.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No networks found
              </h3>
              <p className="text-sm text-white/60">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </main>
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
