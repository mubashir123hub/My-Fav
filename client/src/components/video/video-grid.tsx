import { VideoCard } from "./video-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Video, Channel, User } from "@shared/schema";
import { cn } from "@/lib/utils";

interface VideoGridProps {
  videos?: Video[];
  channels?: Channel[];
  users?: User[];
  isLoading?: boolean;
  variant?: "default" | "horizontal";
  className?: string;
}

function VideoSkeleton({ variant = "default" }: { variant?: "default" | "horizontal" }) {
  const isHorizontal = variant === "horizontal";

  return (
    <div className={cn(
      "space-y-3",
      isHorizontal && "flex gap-4"
    )}>
      <Skeleton className={cn(
        "rounded-lg",
        isHorizontal ? "w-48 h-28" : "aspect-video w-full"
      )} />
      <div className={cn("space-y-2", isHorizontal && "flex-1")}>
        <div className="flex gap-3">
          {!isHorizontal && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoGrid({ 
  videos = [], 
  channels = [], 
  users = [],
  isLoading = false,
  variant = "default",
  className 
}: VideoGridProps) {
  if (isLoading) {
    return (
      <div className={cn(
        variant === "horizontal" 
          ? "space-y-4" 
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        className
      )}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="neon-card-loading">
            <VideoSkeleton variant={variant} />
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No videos found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try adjusting your search criteria or browse our trending videos.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      variant === "horizontal" 
        ? "space-y-4" 
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      className
    )}>
      {videos.map((video) => {
        const channel = channels.find(c => c.id === video.channelId);
        const user = channel ? users.find(u => u.id === channel.userId) : undefined;
        
        return (
          <VideoCard
            key={video.id}
            video={video}
            channel={channel}
            user={user}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
