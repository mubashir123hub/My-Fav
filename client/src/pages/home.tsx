import { useQuery } from "@tanstack/react-query";
import { VideoGrid } from "@/components/video/video-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame, Clock } from "lucide-react";
import type { Video, Channel, User } from "@shared/schema";

const categories = [
  { name: "All", active: true },
  { name: "Gaming", active: false },
  { name: "Music", active: false },
  { name: "Technology", active: false },
  { name: "Entertainment", active: false },
  { name: "Education", active: false },
  { name: "Sports", active: false },
  { name: "News", active: false },
];

export default function Home() {
  // Use enhanced trending algorithm instead of regular videos
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos/trending"],
  });

  const { data: channels = [] } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  return (
    <div className="space-y-6">
      {/* Hero section with enhanced neon styling */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 p-8 neon-border-primary">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-6 w-6 text-primary neon-pulse" />
            <h1 className="text-2xl font-bold">Trending Now</h1>
            <span className="text-xs bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-bold">
              NEXUS AI POWERED
            </span>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Discover the most popular videos powered by our enhanced NEXUS algorithm - 
            superior to YouTube's recommendation system with real-time engagement prediction and multi-dimensional trending analysis.
          </p>
          <div className="flex items-center gap-3">
            <Button size="lg" className="gap-2 neon-button-primary">
              <TrendingUp className="h-4 w-4" />
              Explore Trending
            </Button>
            <Button variant="outline" size="lg" className="gap-2 neon-border-subtle">
              <Clock className="h-4 w-4" />
              Watch Later
            </Button>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 h-32 w-32 rounded-full bg-primary animate-pulse" />
          <div className="absolute bottom-8 left-8 h-24 w-24 rounded-full bg-accent animate-pulse delay-1000" />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Badge
            key={category.name}
            variant={category.active ? "default" : "secondary"}
            className={`cursor-pointer whitespace-nowrap px-4 py-2 hover:bg-primary/80 transition-colors ${
              category.active ? 'neon-border-subtle' : ''
            }`}
          >
            {category.name}
          </Badge>
        ))}
      </div>

      {/* Videos grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest Videos</h2>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        
        <VideoGrid
          videos={videos}
          channels={channels}
          users={users}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
