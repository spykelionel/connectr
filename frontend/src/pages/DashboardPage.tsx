import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatNumber, getInitials } from "@/lib/utils";
import type { Post } from "@/services/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  Heart,
  Image as ImageIcon,
  Link as LinkIcon,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Share2,
  Smile,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreatePostMutation,
  useGetPostsQuery,
  useReactToPostMutation,
} from "../services/api";
import { RootState } from "../store";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [newPost, setNewPost] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);

  const { data: posts = [], isLoading } = useGetPostsQuery();
  const [createPost] = useCreatePostMutation();
  const [reactToPost] = useReactToPostMutation();

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      await createPost({ body: newPost }).unwrap();
      setNewPost("");
      setShowCreatePost(false);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleReactToPost = async (
    postId: string,
    reactionType: "upvote" | "downvote"
  ) => {
    try {
      await reactToPost({ postId, reactionType }).unwrap();
    } catch (error) {
      console.error("Failed to react to post:", error);
    }
  };

  const PostCard = ({ post }: { post: Post }) => {
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState("");

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="glass-card border-white/20 hover-lift">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.user?.profileurl} />
                  <AvatarFallback className="bg-cosmic-600 text-white">
                    {getInitials(post.user?.name || "Unknown")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-semibold">
                    {post.user?.name}
                  </h4>
                  <p className="text-space-400 text-sm">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-space-400 hover:text-white"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {post.body && (
              <p className="text-space-200 leading-relaxed">{post.body}</p>
            )}

            {post.attachment && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={post.attachment}
                  alt="Post attachment"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}

            {/* Engagement stats */}
            <div className="flex items-center justify-between text-sm text-space-400">
              <div className="flex items-center space-x-4">
                <span>{formatNumber(post.upvotes?.length || 0)} likes</span>
                <span>{formatNumber(post.comments?.length || 0)} comments</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                className="text-space-400 hover:text-red-400 hover:bg-red-400/10"
                onClick={() => handleReactToPost(post.id, "upvote")}
              >
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-space-400 hover:text-blue-400 hover:bg-blue-400/10"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Comment
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-space-400 hover:text-green-400 hover:bg-green-400/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Comments section */}
            <AnimatePresence>
              {showComments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-4 border-t border-white/10"
                >
                  {/* Comment input */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profileurl} />
                      <AvatarFallback className="bg-cosmic-600 text-white text-xs">
                        {getInitials(user?.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex items-center space-x-2">
                      <Textarea
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[40px] bg-white/10 border-white/20 text-white placeholder:text-space-400 resize-none"
                      />
                      <Button
                        size="sm"
                        className="cosmic"
                        onClick={() => {
                          // TODO: Implement comment creation
                          setComment("");
                        }}
                        disabled={!comment.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Comments list */}
                  <div className="space-y-3">
                    {post.comments?.slice(0, 3).map((comment) => (
                      <div
                        key={comment.id}
                        className="flex items-start space-x-3"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.user?.profileurl} />
                          <AvatarFallback className="bg-cosmic-600 text-white text-xs">
                            {getInitials(comment.user?.name || "U")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-white font-medium text-sm">
                              {comment.user?.name}
                            </p>
                            <p className="text-space-300 text-sm mt-1">
                              {comment.body}
                            </p>
                          </div>
                          <p className="text-space-500 text-xs mt-1">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* User Profile Card */}
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user?.profileurl} />
                  <AvatarFallback className="bg-cosmic-600 text-white text-xl">
                    {getInitials(user?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-white font-semibold text-lg">
                  {user?.name}
                </h3>
                <p className="text-space-400 text-sm">{user?.email}</p>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-white font-semibold">1.2K</div>
                    <div className="text-space-400 text-xs">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">5.8K</div>
                    <div className="text-space-400 text-xs">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">12</div>
                    <div className="text-space-400 text-xs">Networks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <h3 className="text-white font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start cosmic"
                onClick={() => setShowCreatePost(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start glass-card text-white border-white/20"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Share Photo
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start glass-card text-white border-white/20"
              >
                <Video className="w-4 h-4 mr-2" />
                Share Video
              </Button>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <h3 className="text-white font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "#TechInnovation",
                "#CosmicConnections",
                "#FutureOfWork",
                "#DigitalCommunity",
              ].map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-space-300 text-sm">{topic}</span>
                  <span className="text-cosmic-400 text-xs">
                    {Math.floor(Math.random() * 1000)} posts
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6">
          {/* Create Post */}
          <Card className="glass-card border-white/20 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.profileurl} />
                  <AvatarFallback className="bg-cosmic-600 text-white">
                    {getInitials(user?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[60px] bg-white/10 border-white/20 text-white placeholder:text-space-400 resize-none"
                    onClick={() => setShowCreatePost(true)}
                  />
                </div>
              </div>

              <AnimatePresence>
                {showCreatePost && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-space-400 hover:text-white"
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Photo
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-space-400 hover:text-white"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Video
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-space-400 hover:text-white"
                        >
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Link
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-space-400 hover:text-white"
                        >
                          <Smile className="w-4 h-4 mr-2" />
                          Emoji
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCreatePost(false)}
                          className="glass-card text-white border-white/20"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="cosmic"
                          onClick={handleCreatePost}
                          disabled={!newPost.trim()}
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="glass-card border-white/20">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="w-24 h-4 bg-white/20 rounded"></div>
                            <div className="w-16 h-3 bg-white/20 rounded"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full h-4 bg-white/20 rounded"></div>
                          <div className="w-3/4 h-4 bg-white/20 rounded"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Network Suggestions */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <h3 className="text-white font-semibold flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Suggested Networks
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: "Tech Innovators",
                  members: "12.5K",
                  description: "Latest in technology",
                },
                {
                  name: "Creative Minds",
                  members: "8.9K",
                  description: "Art and design community",
                },
                {
                  name: "Startup Founders",
                  members: "5.2K",
                  description: "Entrepreneurship network",
                },
              ].map((network, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      {network.name}
                    </h4>
                    <p className="text-space-400 text-xs">
                      {network.description}
                    </p>
                    <p className="text-space-500 text-xs">
                      {network.members} members
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="glass-card text-white border-white/20"
                  >
                    Join
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Connection Suggestions */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <h3 className="text-white font-semibold flex items-center">
                <Users className="w-4 h-4 mr-2" />
                People You May Know
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Alex Johnson", role: "Software Engineer", mutual: 12 },
                { name: "Sarah Chen", role: "UX Designer", mutual: 8 },
                { name: "Mike Rodriguez", role: "Product Manager", mutual: 15 },
              ].map((person, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-cosmic-600 text-white text-sm">
                      {getInitials(person.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">
                      {person.name}
                    </h4>
                    <p className="text-space-400 text-xs">{person.role}</p>
                    <p className="text-space-500 text-xs">
                      {person.mutual} mutual connections
                    </p>
                  </div>
                  <Button size="sm" className="cosmic">
                    Connect
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <h3 className="text-white font-semibold">Recent Activity</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Alex liked your post",
                "Sarah commented on your photo",
                "Mike shared your update",
                "Emma joined your network",
              ].map((activity, index) => (
                <div key={index} className="text-space-300 text-sm">
                  {activity}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
