import FindPeopleModal from "@/components/connections/FindPeopleModal";
import CreatePostModal from "@/components/posts/CreatePostModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useInfinitePosts } from "@/hooks/useInfinitePosts";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { formatDate, getInitials } from "@/lib/utils";
import type { Comment, Post } from "@/services/post/interface";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  Heart,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Share2,
  ThumbsDown,
  UserPlus,
  Users,
  Video,
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useCreateCommentMutation,
  useReactToPostMutation,
} from "../services/api";
import { RootState } from "../store";

const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showFindPeopleModal, setShowFindPeopleModal] = useState(false);

  const { posts, isLoading, isFetchingMore, hasNextPage, loadMore } =
    useInfinitePosts({ limit: 10 });

  const [reactToPost] = useReactToPostMutation();
  const [createComment] = useCreateCommentMutation();

  // Infinite scroll hook
  const { sentinelRef } = useInfiniteScroll({
    hasNextPage,
    isFetching: isFetchingMore,
    onLoadMore: loadMore,
  });

  const handleReactToPost = async (
    postId: string,
    reactionType: "upvote" | "downvote"
  ) => {
    try {
      await reactToPost({
        postId,
        reactionType,
      }).unwrap();
    } catch (error) {
      console.error("Failed to react to post:", error);
    }
  };

  const handleCreateComment = async (postId: string, commentText: string) => {
    if (!commentText.trim() || !user?.id) return;

    try {
      await createComment({
        body: commentText,
        postId,
        userId: user.id,
      }).unwrap();
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const PostCard = ({ post }: { post: Post }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const handleSubmitComment = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!commentText.trim()) return;

      setIsSubmittingComment(true);
      try {
        await handleCreateComment(post.id, commentText);
        setCommentText("");
        setShowComments(false);
      } catch (error) {
        console.error("Failed to submit comment:", error);
      } finally {
        setIsSubmittingComment(false);
      }
    };

    const upvotes = post.upvotes?.length || 0;
    const downvotes = post.downvotes?.length || 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-white/10 bg-white/5 p-6"
      >
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={post.user?.profileurl} />
            <AvatarFallback className="bg-blue-500">
              {getInitials(post.user?.name || "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">
                  {post.user?.name || "Unknown User"}
                </h3>
                <p className="text-sm text-white/60">
                  {formatDate(post.createdAt)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:bg-white/10"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-3 text-white/90">{post.body}</p>

            {post.attachment && (
              <div className="mt-4 overflow-hidden rounded-lg">
                <img
                  src={post.attachment}
                  alt="Post content"
                  className="w-full"
                />
              </div>
            )}

            <div className="mt-4 flex items-center gap-1 text-sm text-white/60">
              <span>{upvotes} likes</span>
              <span>•</span>
              <span>{post.comments?.length || 0} comments</span>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-white/60 hover:bg-white/10 hover:text-white"
                onClick={() => handleReactToPost(post.id, "upvote")}
              >
                <Heart className="h-4 w-4" />
                Like ({upvotes})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-white/60 hover:bg-white/10 hover:text-white"
                onClick={() => handleReactToPost(post.id, "downvote")}
              >
                <ThumbsDown className="h-4 w-4" />
                Dislike ({downvotes})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-white/60 hover:bg-white/10 hover:text-white"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                Comment
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
              {showComments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 border-t border-white/10 pt-4"
                >
                  {/* Comment Form */}
                  <form onSubmit={handleSubmitComment} className="mb-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                        rows={2}
                      />
                      <Button
                        type="submit"
                        disabled={!commentText.trim() || isSubmittingComment}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {post.comments?.map((comment: Comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-500 text-xs">
                            {getInitials(comment.user?.name || "U")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-sm font-medium text-white">
                              {comment.user?.name || "Unknown User"}
                            </p>
                            <p className="text-sm text-white/80 mt-1">
                              {comment.body}
                            </p>
                            <p className="text-xs text-white/60 mt-1">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[1fr_320px]">
      {/* Feed */}
      <div className="space-y-6">
        {/* Post Composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-all duration-300"
        >
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={user?.profileurl} />
              <AvatarFallback className="bg-blue-500">
                {getInitials(user?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Button
                className="w-full justify-start text-left text-white/40 hover:bg-white/5 hover:text-white/60 transition-all duration-200 h-12"
                onClick={() => setShowCreatePostModal(true)}
              >
                What's on your mind?
              </Button>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setShowCreatePostModal(true)}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setShowCreatePostModal(true)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setShowCreatePostModal(true)}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Event
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Feed */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Posts Feed</h2>
        </div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-4" />
            <div className="text-white/60">Loading posts...</div>
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Plus className="h-8 w-8 text-white/40" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No posts yet
            </h3>
            <p className="text-white/60 mb-4">
              Be the first to share something!
            </p>
            <Button
              onClick={() => setShowCreatePostModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Create Post
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Infinite Scroll Loading */}
        {isFetchingMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-8"
          >
            <div className="flex items-center gap-2 text-white/60">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more posts...</span>
            </div>
          </motion.div>
        )}

        {/* Load More Button (Fallback) */}
        {hasNextPage && !isFetchingMore && (
          <div className="flex justify-center py-4">
            <Button
              onClick={loadMore}
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              Load More Posts
            </Button>
          </div>
        )}

        {/* End of Feed Message */}
        {!hasNextPage && posts.length > 0 && (
          <div className="text-center py-8 text-white/60">
            <p>You've reached the end of the feed!</p>
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        <div ref={sentinelRef} className="h-4" />
      </div>

      {/* Right Sidebar */}
      <aside className="space-y-6">
        {/* Suggested Networks */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-white/60" />
            <h2 className="font-semibold text-white">Suggested Networks</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                name: "Tech Innovators",
                description: "Latest in technology",
                members: "12.5K",
              },
              {
                name: "Creative Minds",
                description: "Art and design community",
                members: "8.9K",
              },
              {
                name: "Startup Founders",
                description: "Entrepreneurship network",
                members: "6.2K",
              },
            ].map((network) => (
              <div
                key={network.name}
                className="flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-white">{network.name}</h3>
                  <p className="text-sm text-white/60">{network.description}</p>
                  <p className="text-xs text-white/40">
                    {network.members} members
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 bg-transparent text-white hover:bg-white/10"
                >
                  Join
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* People You May Know */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-white/60" />
            <h2 className="font-semibold text-white">People You May Know</h2>
          </div>
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-sm text-white/60">No suggestions available</p>
            <Button
              size="sm"
              className="mt-4 gap-2 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setShowFindPeopleModal(true)}
            >
              <UserPlus className="h-4 w-4" />
              Find People
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h2 className="mb-4 font-semibold text-white">Recent Activity</h2>
          <div className="space-y-3">
            {[
              "Alex liked your post",
              "Sarah commented on your photo",
              "Mike shared your update",
              "Emma joined your network",
            ].map((activity, i) => (
              <div key={i} className="text-sm text-white/80">
                {activity}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onSuccess={() => {
          // Optionally refresh posts or show success message
        }}
      />

      <FindPeopleModal
        isOpen={showFindPeopleModal}
        onClose={() => setShowFindPeopleModal(false)}
        onSuccess={() => {
          // Refresh data
          window.location.reload();
        }}
      />
    </div>
  );
};

export default DashboardPage;
