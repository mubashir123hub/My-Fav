import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Video, Image } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { VIDEO_CATEGORIES, MOCK_THUMBNAILS } from "@/lib/constants";
import type { InsertVideo } from "@shared/schema";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  channelId: number;
  onSuccess?: () => void;
}

export function VideoUpload({ channelId, onSuccess }: VideoUploadProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    isPublic: true,
  });
  const [selectedThumbnail, setSelectedThumbnail] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (uploadData: any) => {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiRequest("POST", "/api/videos/upload", uploadData);
      clearInterval(interval);
      setUploadProgress(100);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "Video uploaded successfully!",
        description: `Your video has been uploaded to Google Drive. Storage used: ${data.quota.used}`,
      });
      setUploadProgress(0);
      onSuccess?.();
    },
    onError: (error: any) => {
      setUploadProgress(0);
      
      if (error.error === "STORAGE_FULL") {
        toast({
          title: "Google Drive Storage Full",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload failed",
          description: error.message || "There was an error uploading your video. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your video.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedThumbnail) {
      toast({
        title: "Thumbnail required",
        description: "Please select a thumbnail for your video.",
        variant: "destructive",
      });
      return;
    }

    // Simulate video file size (between 50MB to 2GB)
    const fileSizeMB = Math.floor(Math.random() * 1950) + 50; // 50MB to 2GB
    const fileSize = fileSizeMB * 1024 * 1024; // Convert to bytes

    const uploadData = {
      channelId,
      title: formData.title.trim(),
      description: formData.description.trim() || "",
      thumbnail: selectedThumbnail,
      videoFile: `simulated_video_${Date.now()}.mp4`, // Simulate video file
      fileSize,
      category: formData.category || undefined,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      isPublic: formData.isPublic,
    };

    uploadMutation.mutate(uploadData);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    // In a real app, handle file upload here
    toast({
      title: "File upload simulated",
      description: "In a real app, this would upload your video file.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Video upload area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Upload Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              uploadProgress > 0 && uploadProgress < 100 && "pointer-events-none opacity-50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploadProgress > 0 && uploadProgress < 100 ? (
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploading your video...</p>
                  <Progress value={uploadProgress} className="w-full max-w-sm mx-auto" />
                  <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium">Drag and drop your video file here</p>
                  <p className="text-sm text-muted-foreground">
                    or <Button variant="link" className="p-0 h-auto">click to browse</Button>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supports MP4, MOV, AVI up to 2GB
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video details form */}
      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter your video title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell viewers about your video..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/1000 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {VIDEO_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="gaming, review, tech (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>

            {/* Thumbnail selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Thumbnail *
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MOCK_THUMBNAILS.slice(0, 4).map((thumbnail, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedThumbnail(thumbnail)}
                    className={cn(
                      "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
                      selectedThumbnail === thumbnail
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <img
                      src={thumbnail}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedThumbnail === thumbnail && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          Selected
                        </Badge>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded border-border"
                  />
                  Make this video public
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={uploadMutation.isPending || !formData.title.trim() || !selectedThumbnail}
                className="min-w-32"
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload Video"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
