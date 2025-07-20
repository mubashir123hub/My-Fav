import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user/user-avatar";
import { 
  MoreVertical, 
  Clock, 
  Eye, 
  ThumbsUp,
  Share,
  Bookmark 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDuration, formatViewCount, formatTimeAgo } from "@/lib/animations";
import type { Video, Channel, User } from "@shared/schema";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: Video;
  channel?: Channel;
  user?: User;
  variant?: "default" | "horizontal";
  className?: string;
}

export function VideoCard({ 
  video, 
  channel, 
  user, 
  variant = "default",
  className 
}: VideoCardProps) {
  const isHorizontal = variant === "horizontal";

  return (
    <Card className={cn(
      "group overflow-hidden border-0 bg-transparent hover-lift",
      className
    )}>
      <CardContent className={cn(
        "p-0",
        isHorizontal ? "flex gap-4" : "space-y-3"
      )}>
        {/* Thumbnail */}
        <Link href={`/watch/${video.id}`}>
          <div className={cn(
            "relative overflow-hidden rounded-lg bg-muted",
            isHorizontal ? "w-48 flex-shrink-0" : "aspect-video w-full"
          )}>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Duration badge */}
            <Badge 
              variant="secondary" 
              className="absolute bottom-2 right-2 bg-black/80 text-white hover:bg-black/80"
            >
              <Clock className="mr-1 h-3 w-3" />
              {formatDuration(video.duration)}
            </Badge>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </Link>

        {/* Content */}
        <div className={cn(
          "space-y-2",
          isHorizontal ? "flex-1" : ""
        )}>
          <div className="flex items-start gap-3">
            {!isHorizontal && channel && user && (
              <UserAvatar
                src={user.avatar}
                fallback={user.displayName[0]}
                size="sm"
                isVerified={user.isVerified}
                className="mt-1"
              />
            )}
            
            <div className="min-w-0 flex-1">
              <Link href={`/watch/${video.id}`}>
                <h3 className="font-medium leading-tight text-foreground hover:text-primary transition-colors line-clamp-2">
                  {video.title}
                </h3>
              </Link>
              
              {channel && (
                <Link href={`/channel/${channel.id}`}>
                  <p className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {channel.name}
                    {user?.isVerified && (
                      <Badge variant="secondary" className="ml-1 h-4 w-4 p-0">
                        <Check className="h-2 w-2" />
                      </Badge>
                    )}
                  </p>
                </Link>
              )}
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formatViewCount(video.viewCount)} views
                </span>
                <span>•</span>
                <span>{formatTimeAgo(new Date(video.uploadedAt!))}</span>
              </div>

              {isHorizontal && video.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {video.description}
                </p>
              )}
            </div>

            {/* Actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save to Watch Later
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Like
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
