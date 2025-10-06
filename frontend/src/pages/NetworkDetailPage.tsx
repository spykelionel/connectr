import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Globe, MessageCircle, Users } from "lucide-react";

const NetworkDetailPage = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Network Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass-card border-white/20">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-cosmic-600 text-white text-2xl">
                    {getInitials("Tech Innovators")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white">
                    Tech Innovators
                  </h1>
                  <p className="text-space-300 text-lg mt-2">
                    Latest in technology and innovation
                  </p>
                  <div className="flex items-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2 text-space-400">
                      <Users className="w-4 h-4" />
                      <span>12,500 members</span>
                    </div>
                    <div className="flex items-center space-x-2 text-space-400">
                      <MessageCircle className="w-4 h-4" />
                      <span>Active community</span>
                    </div>
                    <div className="flex items-center space-x-2 text-space-400">
                      <Calendar className="w-4 h-4" />
                      <span>Created 2 years ago</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    You're a member
                  </div>
                  <div className="text-space-400 text-sm">
                    Joined 3 months ago
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Network Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">
                  Recent Posts
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-12">
                    <Globe className="w-16 h-16 text-space-500 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">
                      No posts yet
                    </h3>
                    <p className="text-space-400">
                      Be the first to share something with this network!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <h3 className="text-white font-semibold">Network Info</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">About</h4>
                  <p className="text-space-300 text-sm">
                    A community for technology enthusiasts, innovators, and
                    professionals who are passionate about the latest
                    developments in tech.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Rules</h4>
                  <ul className="text-space-300 text-sm space-y-1">
                    <li>• Be respectful and constructive</li>
                    <li>• Share relevant tech content</li>
                    <li>• No spam or self-promotion</li>
                    <li>• Keep discussions on-topic</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <h3 className="text-white font-semibold">Top Members</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Alex Johnson", role: "Lead Developer" },
                  { name: "Sarah Chen", role: "Tech Lead" },
                  { name: "Mike Rodriguez", role: "CTO" },
                ].map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-cosmic-600 text-white text-xs">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {member.name}
                      </p>
                      <p className="text-space-400 text-xs">{member.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkDetailPage;
