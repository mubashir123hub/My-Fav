import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-provider";
import { Upload, Camera, User, ArrowLeft } from "lucide-react";

export default function CreateChannelPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatar: "",
    banner: "",
  });

  const createChannelMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/channels", {
        userId: user?.id,
        name: data.name,
        description: data.description || null,
        avatar: data.avatar || null,
        banner: data.banner || null,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/channels"] });
      toast({
        title: "Channel created successfully!",
        description: `Welcome to your new channel: ${data.name}`,
      });
      setLocation(`/channel/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Failed to create channel",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Channel name required",
        description: "Please enter a name for your channel",
        variant: "destructive",
      });
      return;
    }
    createChannelMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            You need to be logged in to create a channel.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Your Channel</h1>
          <p className="text-muted-foreground">Start sharing your content with the world</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Channel Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Channel Avatar */}
            <div className="space-y-2">
              <Label>Channel Avatar</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {formData.name[0]?.toUpperCase() || "C"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    placeholder="Avatar URL (optional)"
                    value={formData.avatar}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter an image URL or leave blank for default avatar
                  </p>
                </div>
              </div>
            </div>

            {/* Channel Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Channel Name *</Label>
              <Input
                id="name"
                placeholder="Enter your channel name..."
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                maxLength={100}
                required
              />
            </div>

            {/* Channel Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell people what your channel is about..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                maxLength={1000}
                rows={4}
              />
            </div>

            {/* Channel Banner */}
            <div className="space-y-2">
              <Label htmlFor="banner">Banner URL</Label>
              <Input
                id="banner"
                placeholder="Channel banner image URL (optional)"
                value={formData.banner}
                onChange={(e) => setFormData(prev => ({ ...prev, banner: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Recommended size: 2560 x 1440 pixels
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={createChannelMutation.isPending}
                className="flex-1"
              >
                {createChannelMutation.isPending ? "Creating..." : "Create Channel"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}