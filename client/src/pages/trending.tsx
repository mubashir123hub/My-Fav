import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Play, Eye, ThumbsUp, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Video, Channel, User } from "@shared/schema";

interface TrendingVideo extends Video {
  channel: Channel;
  user: User;
}

export default function TrendingPage() {
  const { data: videos, isLoading } = useQuery<TrendingVideo[]>({
    queryKey: ["/api/videos/trending"],
  });

  const { data: channels } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Create enhanced videos with channel/user data
  const enhancedVideos = videos?.map(video => {
    const channel = channels?.find(c => c.id === video.channelId);
    const user = users?.find(u => u.id === channel?.userId);
    return { ...video, channel, user };
  }).filter(v => v.channel && v.user) || [];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Trending</h1>
            <p className="text-muted-foreground">Popular videos right now</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="flex gap-4 p-4">
                <div className="w-40 h-24 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Trending</h1>
          <p className="text-muted-foreground">Popular videos right now</p>
        </div>
      </div>

      <div className="grid gap-4">
        {enhancedVideos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingUp className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No trending videos yet</h3>
              <p className="text-muted-foreground max-w-md">
                Videos with high view counts and engagement will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          enhancedVideos.map((video, index) => (
            <Card key={video.id} className="hover:shadow-lg transition-all duration-200">
              <CardContent className="flex gap-4 p-4">
                <div className="relative">
                  <Badge className="absolute -top-2 -left-2 z-10 bg-primary">
                    #{index + 1}
                  </Badge>
                  <Link href={`/watch/${video.id}`}>
                    <div className="relative w-40 h-24 rounded-lg overflow-hidden bg-muted group cursor-pointer">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                        <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="flex-1 space-y-2">
                  <Link href={`/watch/${video.id}`}>
                    <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                      {video.title}
                    </h3>
                  </Link>
                  
                  <Link href={`/channel/${video.channelId}`}>
                    <p className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                      {video.channel?.name}
                    </p>
                  </Link>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {(video.viewCount || 0).toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {(video.likeCount || 0).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(video.uploadedAt || new Date()).toLocaleDateString()}
                    </div>
                  </div>

                  {video.tags && video.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {video.tags.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}