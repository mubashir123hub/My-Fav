import { createReadStream } from "fs";

// Google Drive API simulation for Netlify deployment
export interface DriveFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  webViewLink: string;
  downloadUrl: string;
}

export interface DriveQuota {
  limit: number; // Total storage in bytes
  usage: number; // Used storage in bytes
  remaining: number; // Remaining storage in bytes
}

// Simulated Google Drive storage limits (15GB free tier)
const GOOGLE_DRIVE_LIMIT = 15 * 1024 * 1024 * 1024; // 15GB in bytes
let currentUsage = 8.5 * 1024 * 1024 * 1024; // Simulate 8.5GB already used

export class GoogleDriveService {
  private folderId: string;
  
  constructor(folderId: string = "videotube_uploads") {
    this.folderId = folderId;
  }

  async getQuota(): Promise<DriveQuota> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const remaining = Math.max(0, GOOGLE_DRIVE_LIMIT - currentUsage);
    
    return {
      limit: GOOGLE_DRIVE_LIMIT,
      usage: currentUsage,
      remaining
    };
  }

  async uploadVideo(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string = "video/mp4"
  ): Promise<DriveFile> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fileSize = fileBuffer.length;
    const quota = await this.getQuota();

    // Check if there's enough space
    if (fileSize > quota.remaining) {
      throw new DriveStorageFullError(
        `Not enough storage space. Need ${this.formatBytes(fileSize)}, but only ${this.formatBytes(quota.remaining)} available.`,
        quota
      );
    }

    // Simulate file upload
    const fileId = `drive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Update usage
    currentUsage += fileSize;

    return {
      id: fileId,
      name: fileName,
      size: fileSize,
      mimeType,
      webViewLink: `https://drive.google.com/file/d/${fileId}/view`,
      downloadUrl: `https://drive.google.com/uc?id=${fileId}&export=download`
    };
  }

  async deleteFile(fileId: string): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real implementation, we'd also reduce the currentUsage
    // For simulation, we'll just return success
    return true;
  }

  async getFileInfo(fileId: string): Promise<DriveFile | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Return simulated file info
    return {
      id: fileId,
      name: `video_${fileId}.mp4`,
      size: 50 * 1024 * 1024, // 50MB
      mimeType: "video/mp4",
      webViewLink: `https://drive.google.com/file/d/${fileId}/view`,
      downloadUrl: `https://drive.google.com/uc?id=${fileId}&export=download`
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Method to simulate filling up storage for testing
  async simulateStorageIncrease(bytes: number): Promise<void> {
    currentUsage += bytes;
  }

  // Method to get current usage percentage
  async getUsagePercentage(): Promise<number> {
    const quota = await this.getQuota();
    return (quota.usage / quota.limit) * 100;
  }
}

export class DriveStorageFullError extends Error {
  public quota: DriveQuota;
  
  constructor(message: string, quota: DriveQuota) {
    super(message);
    this.name = "DriveStorageFullError";
    this.quota = quota;
  }
}

// Default instance
export const driveService = new GoogleDriveService();