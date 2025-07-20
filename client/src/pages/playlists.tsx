import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Plus, List } from "lucide-react";

export default function PlaylistsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bookmark className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Saved Playlists</h1>
            <p className="text-muted-foreground">Your curated video collections</p>
          </div>
        </div>
        <Button variant="default" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Playlist
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <List className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
          <p className="text-muted-foreground max-w-md">
            Create your first playlist to organize videos by topic, mood, or any theme you like.
          </p>
          <Button className="mt-4" variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Playlist
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}