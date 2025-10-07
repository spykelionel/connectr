import CreatePostModal from "@/components/posts/CreatePostModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatNumber, getInitials } from "@/lib/utils";
import type {
  Comment,
  Post,
  PostDownvote,
  PostUpvote,
} from "@/services/post/interface";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Share2,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useCreateCommentMutation,
  useGetPostsQuery,
  useReactToPostMutation,
} from "../services/api";
import { RootState } from "../store";

const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const { data: posts = [], isLoading } = useGetPostsQuery();
  const [reactToPost] = useReactToPostMutation();
  const [createComment] = useCreateCommentMutation();

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

  const handleCreateComment = async (postId: string, commentText: string) => {
    try {
      await createComment({
        postId,
        body: commentText,
        userId: user?.id || "",
      }).unwrap();
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const PostCard = ({ post }: { post: Post }) => {
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState("");

    // Check if current user has upvoted this post
    const hasUpvoted =
      post.upvotes?.some((upvote: PostUpvote) => upvote.userId === user?.id) ||
      false;
    const hasDownvoted =
      post.downvotes?.some(
        (downvote: PostDownvote) => downvote.userId === user?.id
      ) || false;

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
                className={`${
                  hasUpvoted
                    ? "text-red-400 bg-red-400/10"
                    : "text-space-400 hover:text-red-400 hover:bg-red-400/10"
                }`}
                onClick={() => handleReactToPost(post.id, "upvote")}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${hasUpvoted ? "fill-current" : ""}`}
                />
                {hasUpvoted ? "Liked" : "Like"} ({post.upvotes?.length || 0})
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`${
                  hasDownvoted
                    ? "text-blue-400 bg-blue-400/10"
                    : "text-space-400 hover:text-blue-400 hover:bg-blue-400/10"
                }`}
                onClick={() => handleReactToPost(post.id, "downvote")}
              >
                <TrendingUp
                  className={`w-4 h-4 mr-2 ${
                    hasDownvoted ? "fill-current" : ""
                  }`}
                />
                {hasDownvoted ? "Disliked" : "Dislike"} (
                {post.downvotes?.length || 0})
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
                          if (comment.trim()) {
                            handleCreateComment(post.id, comment);
                            setComment("");
                          }
                        }}
                        disabled={!comment.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Comments list */}
                  <div className="space-y-3">
                    {post.comments?.slice(0, 3).map((comment: Comment) => (
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
                onClick={() => setShowCreatePostModal(true)}
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
                  <Button
                    onClick={() => setShowCreatePostModal(true)}
                    className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"
                  >
                    <span className="text-space-400">What's on your mind?</span>
                  </Button>
                </div>
              </div>
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
            ) : Array.isArray(posts) ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : null}
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

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onSuccess={() => {
          // Optionally refresh posts or show success message
        }}
      />
    </div>
  );
};

export default DashboardPage;
