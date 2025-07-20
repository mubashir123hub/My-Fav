import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaySquare, Upload, BarChart3 } from "lucide-react";

export default function YourVideosPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PlaySquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Your Videos</h1>
            <p className="text-muted-foreground">Manage your uploaded content</p>
          </div>
        </div>
        <Button variant="default" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Video
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No videos uploaded yet</h3>
          <p className="text-muted-foreground max-w-md">
            Start creating content by uploading your first video. Share your story with the world!
          </p>
          <Button className="mt-4" variant="default">
            <Upload className="h-4 w-4 mr-2" />
            Upload Your First Video
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}