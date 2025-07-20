import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Clock, Trash2 } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Watch History</h1>
            <p className="text-muted-foreground">Your recently watched videos</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No watch history yet</h3>
          <p className="text-muted-foreground max-w-md">
            Videos you watch will appear here. Start exploring to build your watch history!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}