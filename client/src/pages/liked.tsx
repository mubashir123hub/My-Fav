import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Heart, Download } from "lucide-react";

export default function LikedPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ThumbsUp className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Liked Videos</h1>
            <p className="text-muted-foreground">Videos you've liked</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No liked videos yet</h3>
          <p className="text-muted-foreground max-w-md">
            Videos you like will appear here. Start liking videos to build your collection!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}