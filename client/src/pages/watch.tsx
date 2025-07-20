import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { VideoPlayer } from "@/components/ui/video-player";
import { VideoGrid } from "@/components/video/video-grid";
import { UserAvatar } from "@/components/user/user-avatar";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share, 
  Download, 
  Flag,
  Bell,
  BellOff,
  Send,
  Eye,
  Calendar
} from "lucide-react";
import { formatViewCount, formatTimeAgo } from "@/lib/animations";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Video, Channel, User, Comment } from "@shared/schema";

interface WatchProps {
  videoId: number;
}

export default function Watch({ videoId }: WatchProps) {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  // Fetch video data
  const { data: video, isLoading: videoLoading } = useQuery<Video>({
    queryKey: ["/api/videos", videoId],
  });

  // Fetch channel data
  const { data: channel } = useQuery<Channel>({
    queryKey: ["/api/channels", video?.channelId],
    enabled: !!video?.channelId,
  });

  // Fetch channel owner
  const { data: channelOwner } = useQuery<User>({
    queryKey: ["/api/users", channel?.userId],
    enabled: !!channel?.userId,
  });

  // Fetch related videos
  const { data: relatedVideos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  // Fetch all channels for related videos
  const { data: allChannels = [] } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  // Fetch all users for related videos
  const { data: allUsers = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Fetch comments
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/videos", videoId, "comments"],
    enabled: !!videoId,
  });

  // Record view
  const viewMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/video-views", {
        videoId,
        userId: user?.id,
        watchTime: 0,
      });
    },
  });

  // Like/dislike video
  const likeMutation = useMutation({
    mutationFn: async (isLike: boolean) => {
      await apiRequest("POST", "/api/video-likes", {
        videoId,
        userId: user!.id,
        isLike,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos", videoId] });
    },
  });

  // Subscribe to channel
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/subscriptions", {
        subscriberId: user!.id,
        channelId: channel!.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/channels", channel!.id] });
      toast({
        title: "Subscribed!",
        description: `You're now subscribed to ${channel!.name}`,
      });
    },
  });

  // Add comment
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", "/api/comments", {
        videoId,
        userId: user!.id,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos", videoId, "comments"] });
      setCommentText("");
      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
      });
    },
  });

  // Record view on mount
  React.useEffect(() => {
    if (video && user) {
      viewMutation.mutate();
    }
  }, [video, user]);

  const handleLike = () => {
    if (!isAuthenticated) {
      setLocation("/auth/login");
      return;
    }
    likeMutation.mutate(true);
  };

  const handleDislike = () => {
    if (!isAuthenticated) {
      setLocation("/auth/login");
      return;
    }
    likeMutation.mutate(false);
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      setLocation("/auth/login");
      return;
    }
    subscribeMutation.mutate();
  };

  const handleComment = () => {
    if (!isAuthenticated) {
      setLocation("/auth/login");
      return;
    }
    if (!commentText.trim()) return;
    commentMutation.mutate(commentText.trim());
  };

  if (videoLoading || !video) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-muted animate-pulse rounded-lg" />
          <div className="space-y-3">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="aspect-video w-40 bg-muted animate-pulse rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredRelatedVideos = relatedVideos
    .filter(v => v.id !== videoId)
    .slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Video player */}
        <div className="animate-fadeIn">
          <VideoPlayer
            src={video.videoUrl}
            poster={video.thumbnail}
            className="aspect-video w-full"
            autoPlay={true}
          />
        </div>

        {/* Video info */}
        <div className="space-y-4 animate-slideInUp">
          <div>
            <h1 className="text-2xl font-bold leading-tight mb-2">
              {video.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatViewCount(video.viewCount)} views
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatTimeAgo(new Date(video.uploadedAt!))}
              </span>
              {video.category && (
                <Badge variant="secondary">{video.category}</Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className="gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                {formatViewCount(video.likeCount)}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDislike}
                className="gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                {formatViewCount(video.dislikeCount)}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Flag className="h-4 w-4" />
                Report
              </Button>
            </div>
          </div>

          <Separator />

          {/* Channel info */}
          {channel && channelOwner && (
            <div className="flex items-start gap-4">
              <UserAvatar
                src={channelOwner.avatar}
                fallback={channelOwner.displayName[0]}
                size="lg"
                isVerified={channelOwner.isVerified}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{channel.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatViewCount(channel.subscriberCount)} subscribers
                </p>
                
                {showDescription && video.description && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {video.description}
                    </p>
                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {video.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDescription(!showDescription)}
                  className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
                >
                  {showDescription ? "Show less" : "Show more"}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  onClick={handleSubscribe}
                  disabled={subscribeMutation.isPending}
                  className="gap-2"
                >
                  <Bell className="h-4 w-4" />
                  {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Comments */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {comments.length} Comments
              </h3>
            </div>

            {/* Add comment */}
            {isAuthenticated && (
              <div className="flex gap-3">
                <UserAvatar
                  src={user.avatar}
                  fallback={user.displayName[0]}
                  size="sm"
                />
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleComment}
                      disabled={!commentText.trim() || commentMutation.isPending}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {commentMutation.isPending ? "Posting..." : "Comment"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCommentText("")}
                      disabled={!commentText.trim()}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Comments list */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <UserAvatar
                    src="/api/placeholder-avatar"
                    fallback="U"
                    size="sm"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">User</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(new Date(comment.createdAt!))}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                        <ThumbsUp className="h-3 w-3" />
                        {comment.likeCount}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar with related videos */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Up Next</h3>
        <VideoGrid
          videos={filteredRelatedVideos}
          channels={allChannels}
          users={allUsers}
          variant="horizontal"
          className="space-y-4"
        />
      </div>
    </div>
  );
}
