import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoGrid } from "@/components/video/video-grid";
import { UserAvatar } from "@/components/user/user-avatar";
import { 
  Users, 
  Video, 
  Bell, 
  BellOff, 
  Check, 
  Calendar,
  MapPin,
  ExternalLink
} from "lucide-react";
import { formatViewCount, formatTimeAgo } from "@/lib/animations";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-provider";
import { useToast } from "@/hooks/use-toast";
import type { Channel, User, Video as VideoType, Subscription } from "@shared/schema";

interface ChannelProps {
  channelId: number;
}

export default function Channel({ channelId }: ChannelProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch channel data
  const { data: channel, isLoading: channelLoading } = useQuery<Channel>({
    queryKey: ["/api/channels", channelId],
  });

  // Fetch channel owner
  const { data: channelOwner } = useQuery<User>({
    queryKey: ["/api/users", channel?.userId],
    enabled: !!channel?.userId,
  });

  // Fetch channel videos
  const { data: videos = [], isLoading: videosLoading } = useQuery<VideoType[]>({
    queryKey: ["/api/channels", channelId, "videos"],
    enabled: !!channelId,
  });

  // Real-time subscriber count and analytics
  const { data: realtimeStats } = useQuery({
    queryKey: ["/api/channels", channelId, "realtime-stats"],
    enabled: !!channelId,
    refetchInterval: 30000, // Update every 30 seconds for real-time feel
  });

  // Check if user is subscribed
  const { data: subscriptions = [] } = useQuery<Subscription[]>({
    queryKey: ["/api/users", user?.id, "subscriptions"],
    enabled: !!user?.id,
  });

  const isSubscribed = subscriptions.some(sub => sub.channelId === channelId);

  // Subscribe/unsubscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      if (isSubscribed) {
        await apiRequest("DELETE", `/api/subscriptions/${user!.id}/${channelId}`);
      } else {
        await apiRequest("POST", "/api/subscriptions", {
          subscriberId: user!.id,
          channelId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user!.id, "subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/channels", channelId] });
      toast({
        title: isSubscribed ? "Unsubscribed" : "Subscribed!",
        description: isSubscribed 
          ? `You've unsubscribed from ${channel!.name}`
          : `You're now subscribed to ${channel!.name}`,
      });
    },
  });

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to channels.",
        variant: "destructive",
      });
      return;
    }
    subscribeMutation.mutate();
  };

  if (channelLoading || !channel || !channelOwner) {
    return (
      <div className="space-y-6">
        {/* Banner skeleton with neon glow */}
        <div className="aspect-[6/1] bg-muted animate-pulse rounded-lg neon-border-subtle" />
        
        {/* Channel info skeleton */}
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 bg-muted animate-pulse rounded-full neon-glow-avatar" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-muted animate-pulse rounded w-1/3 neon-shimmer" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
          </div>
        </div>

        {/* Videos grid skeleton with enhanced glow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3 neon-card-loading">
              <div className="aspect-video bg-muted animate-pulse rounded-lg neon-border-video" />
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded neon-shimmer" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Channel banner with enhanced neon border */}
      {channel.banner && (
        <div className="relative aspect-[6/1] overflow-hidden rounded-lg glass animate-fadeIn neon-border-primary">
          <img
            src={channel.banner}
            alt={`${channel.name} banner`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        </div>
      )}

      {/* Channel info */}
      <div className="flex flex-col md:flex-row items-start gap-6 animate-slideInUp">
        <UserAvatar
          src={channel.avatar || channelOwner.avatar}
          fallback={channel.name[0]}
          size="lg"
          isVerified={channel.isVerified}
          className="h-24 w-24 neon-glow-avatar neon-pulse"
        />

        <div className="flex-1 min-w-0 space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold leading-tight">{channel.name}</h1>
              {channel.isVerified && (
                <Badge variant="secondary" className="bg-primary/10 text-primary gap-1">
                  <Check className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                @{channelOwner.username}
              </span>
              <span className="flex items-center gap-1 neon-pulse">
                <Users className="h-4 w-4" />
                {formatViewCount(realtimeStats?.subscriberCount || channel.subscriberCount)} subscribers
                {realtimeStats?.isGrowing && (
                  <span className="text-green-400 text-xs ml-1 animate-pulse">↗ LIVE</span>
                )}
              </span>
              <span className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                {realtimeStats?.videoCount || channel.videoCount} videos
                {realtimeStats?.totalViews && (
                  <span className="text-cyan-400 text-xs ml-1">
                    • {formatViewCount(realtimeStats.totalViews)} total views
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {formatTimeAgo(new Date(channel.createdAt!))}
              </span>
            </div>
          </div>

          {channel.description && (
            <p className="text-sm leading-relaxed max-w-3xl">
              {channel.description}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSubscribe}
              disabled={subscribeMutation.isPending}
              variant={isSubscribed ? "secondary" : "default"}
              className={`gap-2 ${!isSubscribed ? 'neon-button-primary' : ''}`}
            >
              {isSubscribed ? (
                <>
                  <BellOff className="h-4 w-4" />
                  Subscribed
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" />
                  Subscribe
                </>
              )}
            </Button>

            {isAuthenticated && user?.id === channelOwner.id && (
              <Button variant="outline" asChild>
                <Link href="/upload">
                  Upload Video
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Channel content */}
      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest Videos</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {videos.length} videos
              </span>
            </div>
          </div>

          <VideoGrid
            videos={videos}
            channels={[channel]}
            users={[channelOwner]}
            isLoading={videosLoading}
          />
        </TabsContent>

        <TabsContent value="playlists" className="space-y-6">
          <div className="text-center py-12">
            <div className="rounded-full bg-muted p-6 w-fit mx-auto mb-4">
              <Video className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No playlists yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              This channel hasn't created any playlists yet. Check back later!
            </p>
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="text-center py-12">
            <div className="rounded-full bg-muted p-6 w-fit mx-auto mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No community posts</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              This channel hasn't posted anything to their community tab yet.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {channel.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Joined</span>
                      <span>{formatTimeAgo(new Date(channel.createdAt!))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total views</span>
                      <span>{formatViewCount(channel.subscriberCount * 100)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Country</span>
                      <span>Not specified</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Links</h4>
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm" className="justify-start gap-2 h-auto p-0">
                      <ExternalLink className="h-4 w-4" />
                      Visit website
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
