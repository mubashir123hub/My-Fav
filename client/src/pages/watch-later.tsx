import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Bookmark, Play } from "lucide-react";

export default function WatchLaterPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Watch Later</h1>
            <p className="text-muted-foreground">Videos saved for later viewing</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Play className="h-4 w-4" />
          Play All
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Bookmark className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No saved videos</h3>
          <p className="text-muted-foreground max-w-md">
            Save videos to watch later by clicking the "Save" button on any video.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}