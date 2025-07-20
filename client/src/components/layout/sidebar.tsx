import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Compass, 
  History, 
  PlaySquare, 
  ThumbsUp, 
  Clock, 
  Bookmark,
  TrendingUp,
  Music,
  Gamepad2,
  Newspaper,
  Trophy,
  Lightbulb,
  Shirt,
  Settings,
  HelpCircle,
  Flag
} from "lucide-react";
import { useAuth } from "@/contexts/auth-provider";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Trending", href: "/trending", icon: TrendingUp },
];

const library = [
  { name: "History", href: "/history", icon: History },
  { name: "Your Videos", href: "/your-videos", icon: PlaySquare },
  { name: "Liked Videos", href: "/liked", icon: ThumbsUp },
  { name: "Watch Later", href: "/watch-later", icon: Clock },
  { name: "Saved Playlists", href: "/playlists", icon: Bookmark },
];

const categories = [
  { name: "Music", href: "/category/music", icon: Music },
  { name: "Gaming", href: "/category/gaming", icon: Gamepad2 },
  { name: "News", href: "/category/news", icon: Newspaper },
  { name: "Sports", href: "/category/sports", icon: Trophy },
  { name: "Learning", href: "/category/education", icon: Lightbulb },
  { name: "Fashion", href: "/category/fashion", icon: Shirt },
];

const footer = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
  { name: "Send Feedback", href: "/feedback", icon: Flag },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  const NavItem = ({ item }: { item: typeof navigation[0] }) => (
    <Link href={item.href}>
      <Button
        variant={location === item.href ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-3 h-10",
          location === item.href && "bg-primary/10 text-primary hover:bg-primary/20"
        )}
        onClick={onClose}
      >
        <item.icon className="h-5 w-5" />
        {item.name}
      </Button>
    </Link>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform border-r border-border bg-background transition-transform duration-300 ease-in-out md:relative md:top-0 md:h-screen md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-full py-4">
          <div className="space-y-4 px-3">
            {/* Main navigation */}
            <div className="space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>

            <Separator />

            {/* Library section - only show if authenticated */}
            {isAuthenticated && (
              <>
                <div className="space-y-2">
                  <h3 className="px-3 text-sm font-medium text-muted-foreground">Library</h3>
                  {library.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </div>

                <Separator />
              </>
            )}

            {/* Categories */}
            <div className="space-y-2">
              <h3 className="px-3 text-sm font-medium text-muted-foreground">Explore</h3>
              {categories.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>

            <Separator />

            {/* Footer */}
            <div className="space-y-2">
              {footer.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>

            {/* App info */}
            <div className="px-3 pt-4">
              <p className="text-xs text-muted-foreground">
                © 2024 VideoTube
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Advanced YouTube Clone
              </p>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
