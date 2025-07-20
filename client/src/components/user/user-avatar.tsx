import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  isVerified?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function UserAvatar({ 
  src, 
  fallback, 
  size = "md", 
  isVerified = false,
  className 
}: UserAvatarProps) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <Avatar className={cn(sizeClasses[size])}>
        <AvatarImage src={src} />
        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
          {fallback}
        </AvatarFallback>
      </Avatar>
      
      {isVerified && (
        <Badge 
          variant="secondary"
          className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary p-0 flex items-center justify-center"
        >
          <Check className="h-3 w-3 text-primary-foreground" />
        </Badge>
      )}
    </div>
  );
}
