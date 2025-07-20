import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { VideoGrid } from "@/components/video/video-grid";
import { ChannelCard } from "@/components/channel/channel-card";
import { 
  Search as SearchIcon, 
  Filter, 
  SlidersHorizontal,
  Calendar,
  Clock,
  Eye,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Video, Channel, User } from "@shared/schema";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "date", label: "Upload Date" },
  { value: "views", label: "View Count" },
  { value: "duration", label: "Duration" },
];

const filterOptions = [
  { value: "all", label: "All Time" },
  { value: "hour", label: "Last Hour" },
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

const durationFilters = [
  { value: "all", label: "Any Duration" },
  { value: "short", label: "Under 4 minutes" },
  { value: "medium", label: "4-20 minutes" },
  { value: "long", label: "Over 20 minutes" },
];

export default function Search() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [filterBy, setFilterBy] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");

  // Get search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
  }, [location]);

  // Fetch search results
  const { data: videos = [], isLoading: videosLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos", { search: searchQuery }],
    enabled: !!searchQuery,
  });

  // Fetch all channels and users for video cards
  const { data: channels = [] } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Filter and sort results
  const filteredVideos = videos.filter(video => {
    // Duration filter
    if (durationFilter !== "all") {
      if (durationFilter === "short" && video.duration >= 240) return false;
      if (durationFilter === "medium" && (video.duration < 240 || video.duration > 1200)) return false;
      if (durationFilter === "long" && video.duration <= 1200) return false;
    }

    // Time filter
    if (filterBy !== "all") {
      const now = new Date();
      const uploadDate = new Date(video.uploadedAt!);
      const diffMs = now.getTime() - uploadDate.getTime();
      
      switch (filterBy) {
        case "hour":
          if (diffMs > 60 * 60 * 1000) return false;
          break;
        case "day":
          if (diffMs > 24 * 60 * 60 * 1000) return false;
          break;
        case "week":
          if (diffMs > 7 * 24 * 60 * 60 * 1000) return false;
          break;
        case "month":
          if (diffMs > 30 * 24 * 60 * 60 * 1000) return false;
          break;
        case "year":
          if (diffMs > 365 * 24 * 60 * 60 * 1000) return false;
          break;
      }
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.uploadedAt!).getTime() - new Date(a.uploadedAt!).getTime();
      case "views":
        return b.viewCount - a.viewCount;
      case "duration":
        return b.duration - a.duration;
      default:
        return 0; // Relevance (keep original order)
    }
  });

  // Filter channels that match search query
  const filteredChannels = channels.filter(channel =>
    searchQuery && (
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleFilterChange = (type: string, value: string) => {
    switch (type) {
      case "sort":
        setSortBy(value);
        break;
      case "filter":
        setFilterBy(value);
        break;
      case "duration":
        setDurationFilter(value);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search header */}
      <div className="space-y-4 animate-fadeIn">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1 max-w-2xl">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos, channels, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          <Button type="submit" size="lg" className="gap-2">
            <SearchIcon className="h-4 w-4" />
            Search
          </Button>
        </form>

        {searchQuery && (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">
                Search results for "{searchQuery}"
              </h1>
              <p className="text-muted-foreground">
                {filteredVideos.length} videos • {filteredChannels.length} channels
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleFilterChange("sort", option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    {filterOptions.find(opt => opt.value === filterBy)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {filterOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleFilterChange("filter", option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Clock className="h-4 w-4" />
                    {durationFilters.find(opt => opt.value === durationFilter)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {durationFilters.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleFilterChange("duration", option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      {/* Search suggestions when no query */}
      {!searchQuery && (
        <div className="space-y-6 animate-slideInUp">
          <div className="text-center space-y-4 py-12">
            <div className="rounded-full bg-muted p-6 w-fit mx-auto">
              <SearchIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Search VideoTube</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Discover millions of videos from creators around the world. 
                Search for anything that interests you.
              </p>
            </div>
          </div>

          {/* Trending searches */}
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Trending Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "gaming", "music", "technology", "cooking", "travel", 
                  "education", "comedy", "sports", "news", "art"
                ].map((term) => (
                  <Badge
                    key={term}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => {
                      setSearchQuery(term);
                      setLocation(`/search?q=${encodeURIComponent(term)}`);
                    }}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search results */}
      {searchQuery && (
        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="videos">
              Videos ({filteredVideos.length})
            </TabsTrigger>
            <TabsTrigger value="channels">
              Channels ({filteredChannels.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            {filteredVideos.length > 0 ? (
              <VideoGrid
                videos={filteredVideos}
                channels={channels}
                users={users}
                isLoading={videosLoading}
              />
            ) : !videosLoading ? (
              <div className="text-center py-12">
                <div className="rounded-full bg-muted p-6 w-fit mx-auto mb-4">
                  <SearchIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No videos found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Try different keywords or remove some filters to see more results.
                </p>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            {filteredChannels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChannels.map((channel) => {
                  const user = users.find(u => u.id === channel.userId);
                  return (
                    <ChannelCard
                      key={channel.id}
                      channel={channel}
                      user={user}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="rounded-full bg-muted p-6 w-fit mx-auto mb-4">
                  <SearchIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No channels found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Try different keywords to find channels that match your search.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
