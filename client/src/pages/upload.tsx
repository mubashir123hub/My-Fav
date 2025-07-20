import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoUpload } from "@/components/video/video-upload";
import { DriveStorageStatus } from "@/components/drive/drive-storage-status";
import { useAuth } from "@/contexts/auth-provider";
import { Upload as UploadIcon, Plus, Video } from "lucide-react";
import type { Channel } from "@shared/schema";

export default function Upload() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user's channels
  const { data: channels = [], isLoading } = useQuery<Channel[]>({
    queryKey: ["/api/users", user?.id, "channels"],
    enabled: !!user?.id,
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/auth/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-3">
          <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
          <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  // If user has no channels, show create channel prompt
  if (channels.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="rounded-full bg-primary/10 p-6 w-fit mx-auto mb-4">
              <Video className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create Your Channel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              You need to create a channel before you can upload videos. 
              Your channel will be your creative space to share content with the world.
            </p>
            
            <div className="space-y-4">
              <Button size="lg" className="gap-2" onClick={() => setLocation("/create-channel")}>
                <Plus className="h-5 w-5" />
                Create Channel
              </Button>
              
              <p className="text-xs text-muted-foreground">
                By creating a channel, you agree to our terms of service and community guidelines.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user has multiple channels, show channel selector (for now use first channel)
  const selectedChannel = channels[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2 animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <UploadIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Upload Video</h1>
            <p className="text-muted-foreground">
              Share your content with the world
            </p>
          </div>
        </div>
      </div>

      {/* Google Drive Storage Status */}
      <div className="animate-fadeIn delay-100">
        <DriveStorageStatus />
      </div>

      {/* Channel selector (if multiple channels) */}
      {channels.length > 1 && (
        <Card className="animate-slideInUp">
          <CardHeader>
            <CardTitle>Select Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map((channel) => (
                <Card
                  key={channel.id}
                  className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary/20 ${
                    selectedChannel.id === channel.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-medium text-primary">
                          {channel.name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{channel.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {channel.subscriberCount} subscribers
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload component */}
      <div className="animate-slideInUp delay-200">
        <VideoUpload
          channelId={selectedChannel.id}
          onSuccess={() => {
            setLocation(`/channel/${selectedChannel.id}`);
          }}
        />
      </div>

      {/* Tips */}
      <Card className="animate-slideInUp delay-300">
        <CardHeader>
          <CardTitle className="text-lg">Upload Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Video Quality</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Upload in 1080p or higher for best quality</li>
                  <li>• Use MP4 format for compatibility</li>
                  <li>• Keep file size under 2GB</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Thumbnails</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Choose eye-catching, relevant images</li>
                  <li>• Avoid misleading thumbnails</li>
                  <li>• Use high contrast and readable text</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Titles & Descriptions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Write clear, descriptive titles</li>
                  <li>• Include relevant keywords</li>
                  <li>• Add detailed descriptions</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use specific, relevant tags</li>
                  <li>• Include both broad and niche terms</li>
                  <li>• Don't use misleading tags</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
