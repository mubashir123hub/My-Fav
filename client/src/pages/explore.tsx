import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass, TrendingUp, Music, Gamepad2, Newspaper } from "lucide-react";

export default function ExplorePage() {
  const categories = [
    { name: "Trending", icon: TrendingUp, color: "bg-red-500", count: "1.2M" },
    { name: "Music", icon: Music, color: "bg-purple-500", count: "890K" },
    { name: "Gaming", icon: Gamepad2, color: "bg-blue-500", count: "670K" },
    { name: "News", icon: Newspaper, color: "bg-orange-500", count: "450K" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Compass className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Explore</h1>
          <p className="text-muted-foreground">Discover trending content and new channels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">{category.name}</h3>
              <Badge variant="secondary">{category.count} videos</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What's Popular</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Popular content will appear here as you explore different categories.</p>
        </CardContent>
      </Card>
    </div>
  );
}