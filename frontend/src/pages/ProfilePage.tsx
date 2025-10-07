import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate, getInitials } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Edit3, Mail, MapPin, Phone } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass-card border-white/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user?.profileurl} />
                    <AvatarFallback className="bg-cosmic-600 text-white text-2xl">
                      {getInitials(user?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      {user?.name}
                    </h1>
                    <p className="text-space-400 text-lg">{user?.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-space-300 text-sm">
                        Software Engineer
                      </span>
                      <span className="text-space-300 text-sm">•</span>
                      <span className="text-space-300 text-sm">
                        San Francisco, CA
                      </span>
                    </div>
                  </div>
                </div>
                <Button className="cosmic">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">About</h2>
              </CardHeader>
              <CardContent>
                <p className="text-space-300 leading-relaxed">
                  Passionate software engineer with 5+ years of experience
                  building scalable web applications. I love working with modern
                  technologies and contributing to open-source projects. When
                  I'm not coding, you can find me exploring new places or
                  reading about the latest tech trends.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">
                  Recent Posts
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border-b border-white/10 pb-4 last:border-b-0"
                  >
                    <p className="text-space-300">
                      Just shipped a new feature for our React application! The
                      team worked really hard on this one. Excited to see how
                      users respond to the improvements.
                    </p>
                    <p className="text-space-500 text-sm mt-2">
                      {formatDate(new Date())}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">
                  Contact Information
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-cosmic-400" />
                  <span className="text-space-300">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-cosmic-400" />
                  <span className="text-space-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-cosmic-400" />
                  <span className="text-space-300">San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-cosmic-400" />
                  <span className="text-space-300">
                    Joined {formatDate(new Date())}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">Statistics</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">1.2K</div>
                    <div className="text-space-400 text-sm">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">5.8K</div>
                    <div className="text-space-400 text-sm">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-space-400 text-sm">Networks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">89</div>
                    <div className="text-space-400 text-sm">Comments</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
