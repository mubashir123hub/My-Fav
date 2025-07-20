import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  HardDrive, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle,
  Cloud,
  TestTube
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DriveQuotaResponse {
  total: string;
  used: string;
  remaining: string;
  usagePercentage: number;
  isNearlyFull: boolean;
  isFull: boolean;
}

export function DriveStorageStatus() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: quota, isLoading, error } = useQuery<DriveQuotaResponse>({
    queryKey: ["/api/drive/quota"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Mutation to simulate storage increase for testing
  const simulateStorageMutation = useMutation({
    mutationFn: async (increaseGB: number) => {
      const response = await apiRequest("POST", "/api/drive/simulate-storage", { increaseGB });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/drive/quota"] });
      toast({
        title: "Storage simulation updated",
        description: `Added ${data.message.match(/\d+/)[0]}GB. Used: ${data.quota.used}`,
      });
    },
    onError: () => {
      toast({
        title: "Simulation failed",
        description: "Could not simulate storage increase",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Cloud className="h-4 w-4" />
            Google Drive Storage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full animate-pulse" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Loading...</span>
              <span>...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !quota) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load Google Drive storage status
        </AlertDescription>
      </Alert>
    );
  }

  const getStatusColor = () => {
    if (quota.isFull) return "destructive";
    if (quota.isNearlyFull) return "warning";
    return "default";
  };

  const getStatusIcon = () => {
    if (quota.isFull) return <AlertCircle className="h-4 w-4 text-destructive" />;
    if (quota.isNearlyFull) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (quota.isFull) return "Storage Full";
    if (quota.isNearlyFull) return "Nearly Full";
    return "Available";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Google Drive Storage
            </div>
            <Badge variant={getStatusColor() as any} className="gap-1">
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <Progress 
              value={quota.usagePercentage} 
              className={cn(
                "h-2",
                quota.isFull && "[&>div]:bg-destructive",
                quota.isNearlyFull && !quota.isFull && "[&>div]:bg-yellow-500"
              )}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{quota.used} used</span>
              <span>{quota.usagePercentage}% of {quota.total}</span>
            </div>
          </div>

          {/* Storage details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Used</div>
              <div className="font-medium">{quota.used}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Available</div>
              <div className="font-medium">{quota.remaining}</div>
            </div>
          </div>

          {/* Test buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateStorageMutation.mutate(3)}
              disabled={simulateStorageMutation.isPending}
              className="gap-1 text-xs"
            >
              <TestTube className="h-3 w-3" />
              +3GB Test
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateStorageMutation.mutate(6)}
              disabled={simulateStorageMutation.isPending}
              className="gap-1 text-xs"
            >
              <TestTube className="h-3 w-3" />
              Fill Storage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Warning alerts */}
      {quota.isFull && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your Google Drive storage is full. You won't be able to upload new videos until you free up space or upgrade your storage plan.
          </AlertDescription>
        </Alert>
      )}

      {quota.isNearlyFull && !quota.isFull && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your Google Drive storage is almost full ({quota.usagePercentage}%). Consider managing your files or upgrading your storage plan.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}