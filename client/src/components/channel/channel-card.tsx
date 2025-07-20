import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/user/user-avatar";
import { Users, Video, Check } from "lucide-react";
import { formatViewCount } from "@/lib/animations";
import type { Channel, User } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ChannelCardProps {
  channel: Channel;
  user?: User;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
  className?: string;
}

export function ChannelCard({ 
  channel, 
  user, 
  isSubscribed = false,
  onSubscribe,
  className 
}: ChannelCardProps) {
  return (
    <Card className={cn("group overflow-hidden hover-lift", className)}>
      <CardContent className="p-0">
        {/* Banner */}
        {channel.banner && (
          <div className="aspect-[3/1] overflow-hidden">
            <img
              src={channel.banner}
              alt={channel.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <UserAvatar
              src={channel.avatar || user?.avatar}
              fallback={channel.name[0]}
              size="lg"
              isVerified={channel.isVerified}
            />
            
            <div className="flex-1 min-w-0">
              <Link href={`/channel/${channel.id}`}>
                <h3 className="font-semibold text-lg leading-tight text-foreground hover:text-primary transition-colors">
                  {channel.name}
                </h3>
              </Link>
              
              {user && (
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
              )}
              
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {formatViewCount(channel.subscriberCount)} subscribers
                </span>
                <span className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  {channel.videoCount} videos
                </span>
              </div>
            </div>

            {onSubscribe && (
              <Button
                variant={isSubscribed ? "secondary" : "default"}
                size="sm"
                onClick={onSubscribe}
                className={cn(
                  "min-w-24",
                  isSubscribed && "bg-muted hover:bg-destructive hover:text-destructive-foreground"
                )}
              >
                {isSubscribed ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Subscribed
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            )}
          </div>

          {channel.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {channel.description}
            </p>
          )}

          {channel.isVerified && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Check className="mr-1 h-3 w-3" />
              Verified Channel
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
