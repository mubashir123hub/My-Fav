import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-provider";
import {
  Settings,
  BarChart3,
  Video,
  Eye,
  ThumbsUp,
  MessageSquare,
  Upload,
  Edit,
  Trash2,
  Camera,
  Image as ImageIcon,
  Save,
  TrendingUp
} from "lucide-react";
import type { Channel, Video as VideoType } from "@shared/schema";

export default function StudioPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user's channels
  const { data: channels = [] } = useQuery<Channel[]>({
    queryKey: ["/api/users", user?.id, "channels"],
    enabled: !!user?.id,
  });

  // Fetch videos for the main channel
  const mainChannel = channels[0];
  const { data: videos = [] } = useQuery<VideoType[]>({
    queryKey: ["/api/channels", mainChannel?.id, "videos"],
    enabled: !!mainChannel?.id,
  });

  // Channel update mutation
  const updateChannelMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; avatar: string; banner: string }) => {
      const response = await apiRequest("PATCH", `/api/channels/${mainChannel?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/channels"] });
      toast({
        title: "Channel updated successfully!",
        description: "Your channel information has been saved.",
      });
    },
  });

  const [channelForm, setChannelForm] = useState({
    name: mainChannel?.name || "",
    description: mainChannel?.description || "",
    avatar: mainChannel?.avatar || "",
    banner: mainChannel?.banner || "",
  });

  React.useEffect(() => {
    if (mainChannel) {
      setChannelForm({
        name: mainChannel.name,
        description: mainChannel.description || "",
        avatar: mainChannel.avatar || "",
        banner: mainChannel.banner || "",
      });
    }
  }, [mainChannel]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert>
          <AlertDescription>You need to be logged in to access YouTube Studio.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No channel found</h2>
        <p className="text-muted-foreground mb-6">Create a channel to start using YouTube Studio</p>
        <Button onClick={() => setLocation("/create-channel")}>
          Create Channel
        </Button>
      </div>
    );
  }

  const handleChannelUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateChannelMutation.mutate(channelForm);
  };

  // Calculate stats
  const totalViews = videos.reduce((sum, video) => sum + (video.viewCount || 0), 0);
  const totalLikes = videos.reduce((sum, video) => sum + (video.likeCount || 0), 0);
  const avgViews = videos.length > 0 ? Math.round(totalViews / videos.length) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-red-600 p-2">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">YouTube Studio</h1>
            <p className="text-muted-foreground">Manage your channel and content</p>
          </div>
        </div>
        <Button onClick={() => setLocation("/upload")} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {/* Channel Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Views</span>
            </div>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Total Likes</span>
            </div>
            <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Videos</span>
            </div>
            <div className="text-2xl font-bold">{videos.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Avg Views</span>
            </div>
            <div className="text-2xl font-bold">{avgViews.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subscribers</span>
                  <span>{mainChannel?.subscriberCount?.toLocaleString()} / 1M</span>
                </div>
                <Progress value={(mainChannel?.subscriberCount || 0) / 10000} />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                  <div className="text-xl font-bold">+{Math.floor(Math.random() * 10000).toLocaleString()} views</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                  <div className="text-xl font-bold">${Math.floor(Math.random() * 500)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Your Videos</h3>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Bulk Edit
            </Button>
          </div>
          
          {videos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No videos uploaded yet</h3>
                <p className="text-muted-foreground mb-4">Upload your first video to get started</p>
                <Button onClick={() => setLocation("/upload")}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <Card key={video.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-32 h-18 rounded object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <Link href={`/watch/${video.id}`}>
                          <h4 className="font-semibold hover:text-primary cursor-pointer line-clamp-2">
                            {video.title}
                          </h4>
                        </Link>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{(video.viewCount || 0).toLocaleString()} views</span>
                          <span>{(video.likeCount || 0).toLocaleString()} likes</span>
                          <span>{new Date(video.uploadedAt || new Date()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          {video.tags?.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">Detailed analytics will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Channel Customization</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChannelUpdate} className="space-y-6">
                {/* Channel Avatar */}
                <div className="space-y-2">
                  <Label>Channel Avatar</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={channelForm.avatar} />
                      <AvatarFallback className="text-xl">
                        {channelForm.name[0]?.toUpperCase() || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        placeholder="Avatar URL"
                        value={channelForm.avatar}
                        onChange={(e) => setChannelForm(prev => ({ ...prev, avatar: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Channel Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Channel Name</Label>
                  <Input
                    id="name"
                    value={channelForm.name}
                    onChange={(e) => setChannelForm(prev => ({ ...prev, name: e.target.value }))}
                    maxLength={100}
                  />
                </div>

                {/* Channel Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Channel Description</Label>
                  <Textarea
                    id="description"
                    value={channelForm.description}
                    onChange={(e) => setChannelForm(prev => ({ ...prev, description: e.target.value }))}
                    maxLength={1000}
                    rows={4}
                  />
                </div>

                {/* Channel Banner */}
                <div className="space-y-2">
                  <Label htmlFor="banner">Banner URL</Label>
                  <Input
                    id="banner"
                    value={channelForm.banner}
                    onChange={(e) => setChannelForm(prev => ({ ...prev, banner: e.target.value }))}
                  />
                  {channelForm.banner && (
                    <div className="mt-2">
                      <img
                        src={channelForm.banner}
                        alt="Channel banner preview"
                        className="w-full max-w-md h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={updateChannelMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateChannelMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}