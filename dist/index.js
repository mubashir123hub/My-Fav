var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  channels: () => channels,
  comments: () => comments,
  insertChannelSchema: () => insertChannelSchema,
  insertCommentSchema: () => insertCommentSchema,
  insertSubscriptionSchema: () => insertSubscriptionSchema,
  insertUserSchema: () => insertUserSchema,
  insertVideoLikeSchema: () => insertVideoLikeSchema,
  insertVideoSchema: () => insertVideoSchema,
  insertVideoViewSchema: () => insertVideoViewSchema,
  subscriptions: () => subscriptions,
  users: () => users,
  videoLikes: () => videoLikes,
  videoViews: () => videoViews,
  videos: () => videos
});
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  subscriberCount: integer("subscriber_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  banner: text("banner"),
  avatar: text("avatar"),
  subscriberCount: integer("subscriber_count").default(0),
  videoCount: integer("video_count").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  channelId: integer("channel_id").references(() => channels.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail").notNull(),
  videoUrl: text("video_url").notNull(),
  driveFileId: text("drive_file_id"),
  // Google Drive file ID
  fileSize: integer("file_size"),
  // File size in bytes
  duration: integer("duration").notNull(),
  // in seconds
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  dislikeCount: integer("dislike_count").default(0),
  tags: text("tags").array(),
  category: text("category"),
  isPublic: boolean("is_public").default(true),
  uploadStatus: text("upload_status").default("processing"),
  // processing, completed, failed
  uploadedAt: timestamp("uploaded_at").defaultNow()
});
var subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  subscriberId: integer("subscriber_id").references(() => users.id).notNull(),
  channelId: integer("channel_id").references(() => channels.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  likeCount: integer("like_count").default(0),
  parentId: integer("parent_id"),
  // for replies
  createdAt: timestamp("created_at").defaultNow()
});
var videoViews = pgTable("video_views", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  ipAddress: text("ip_address"),
  watchTime: integer("watch_time").default(0),
  // in seconds
  createdAt: timestamp("created_at").defaultNow()
});
var videoLikes = pgTable("video_likes", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  isLike: boolean("is_like").notNull(),
  // true for like, false for dislike
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  subscriberCount: true,
  createdAt: true
});
var insertChannelSchema = createInsertSchema(channels).omit({
  id: true,
  subscriberCount: true,
  videoCount: true,
  createdAt: true
});
var insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  viewCount: true,
  likeCount: true,
  dislikeCount: true,
  uploadedAt: true
});
var insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true
});
var insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  likeCount: true,
  createdAt: true
});
var insertVideoViewSchema = createInsertSchema(videoViews).omit({
  id: true,
  createdAt: true
});
var insertVideoLikeSchema = createInsertSchema(videoLikes).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
var DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_HduBJ9phw1GL@ep-muddy-morning-ad4e2lhd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, desc, ilike, or } from "drizzle-orm";
var DatabaseStorage = class {
  // Users
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getAllUsers() {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, userData) {
    const [user] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return user || void 0;
  }
  // Channels
  async getChannel(id) {
    const [channel] = await db.select().from(channels).where(eq(channels.id, id));
    return channel || void 0;
  }
  async getAllChannels() {
    return await db.select().from(channels).orderBy(desc(channels.subscriberCount));
  }
  async getChannelsByUserId(userId) {
    return await db.select().from(channels).where(eq(channels.userId, userId));
  }
  async createChannel(insertChannel) {
    const [channel] = await db.insert(channels).values(insertChannel).returning();
    return channel;
  }
  async updateChannel(id, channelData) {
    const [channel] = await db.update(channels).set(channelData).where(eq(channels.id, id)).returning();
    return channel || void 0;
  }
  // Videos
  async getVideo(id) {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || void 0;
  }
  async getVideosByChannelId(channelId) {
    return await db.select().from(videos).where(eq(videos.channelId, channelId));
  }
  async getAllVideos() {
    return await db.select().from(videos).orderBy(desc(videos.uploadedAt));
  }
  async searchVideos(query) {
    return await db.select().from(videos).where(
      or(
        ilike(videos.title, `%${query}%`),
        ilike(videos.description, `%${query}%`)
      )
    );
  }
  async createVideo(insertVideo) {
    const [video] = await db.insert(videos).values(insertVideo).returning();
    return video;
  }
  async updateVideo(id, videoData) {
    const [video] = await db.update(videos).set(videoData).where(eq(videos.id, id)).returning();
    return video || void 0;
  }
  // Subscriptions
  async getSubscription(subscriberId, channelId) {
    const [subscription] = await db.select().from(subscriptions).where(
      and(
        eq(subscriptions.subscriberId, subscriberId),
        eq(subscriptions.channelId, channelId)
      )
    );
    return subscription || void 0;
  }
  async getSubscriptionsByUserId(userId) {
    return await db.select().from(subscriptions).where(eq(subscriptions.subscriberId, userId));
  }
  async createSubscription(insertSubscription) {
    const [subscription] = await db.insert(subscriptions).values(insertSubscription).returning();
    return subscription;
  }
  async deleteSubscription(subscriberId, channelId) {
    const result = await db.delete(subscriptions).where(
      and(
        eq(subscriptions.subscriberId, subscriberId),
        eq(subscriptions.channelId, channelId)
      )
    );
    return result.rowCount > 0;
  }
  // Comments
  async getComment(id) {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment || void 0;
  }
  async getCommentsByVideoId(videoId) {
    return await db.select().from(comments).where(eq(comments.videoId, videoId)).orderBy(desc(comments.createdAt));
  }
  async createComment(insertComment) {
    const [comment] = await db.insert(comments).values(insertComment).returning();
    return comment;
  }
  async updateComment(id, commentData) {
    const [comment] = await db.update(comments).set(commentData).where(eq(comments.id, id)).returning();
    return comment || void 0;
  }
  // Video Views
  async createVideoView(insertView) {
    const [view] = await db.insert(videoViews).values(insertView).returning();
    return view;
  }
  async getVideoViewsByVideoId(videoId) {
    return await db.select().from(videoViews).where(eq(videoViews.videoId, videoId));
  }
  // Video Likes
  async getVideoLike(videoId, userId) {
    const [like] = await db.select().from(videoLikes).where(
      and(
        eq(videoLikes.videoId, videoId),
        eq(videoLikes.userId, userId)
      )
    );
    return like || void 0;
  }
  async createVideoLike(insertLike) {
    const [like] = await db.insert(videoLikes).values(insertLike).returning();
    return like;
  }
  async updateVideoLike(videoId, userId, isLike) {
    const [like] = await db.update(videoLikes).set({ isLike }).where(
      and(
        eq(videoLikes.videoId, videoId),
        eq(videoLikes.userId, userId)
      )
    ).returning();
    return like || void 0;
  }
  async deleteVideoLike(videoId, userId) {
    const result = await db.delete(videoLikes).where(
      and(
        eq(videoLikes.videoId, videoId),
        eq(videoLikes.userId, userId)
      )
    );
    return result.rowCount > 0;
  }
};
var storage = new DatabaseStorage();

// server/google-drive.ts
var GOOGLE_DRIVE_LIMIT = 15 * 1024 * 1024 * 1024;
var currentUsage = 8.5 * 1024 * 1024 * 1024;
var GoogleDriveService = class {
  folderId;
  constructor(folderId = "videotube_uploads") {
    this.folderId = folderId;
  }
  async getQuota() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const remaining = Math.max(0, GOOGLE_DRIVE_LIMIT - currentUsage);
    return {
      limit: GOOGLE_DRIVE_LIMIT,
      usage: currentUsage,
      remaining
    };
  }
  async uploadVideo(fileName, fileBuffer, mimeType = "video/mp4") {
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    const fileSize = fileBuffer.length;
    const quota = await this.getQuota();
    if (fileSize > quota.remaining) {
      throw new DriveStorageFullError(
        `Not enough storage space. Need ${this.formatBytes(fileSize)}, but only ${this.formatBytes(quota.remaining)} available.`,
        quota
      );
    }
    const fileId = `drive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
  async deleteFile(fileId) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  }
  async getFileInfo(fileId) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      id: fileId,
      name: `video_${fileId}.mp4`,
      size: 50 * 1024 * 1024,
      // 50MB
      mimeType: "video/mp4",
      webViewLink: `https://drive.google.com/file/d/${fileId}/view`,
      downloadUrl: `https://drive.google.com/uc?id=${fileId}&export=download`
    };
  }
  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
  // Method to simulate filling up storage for testing
  async simulateStorageIncrease(bytes) {
    currentUsage += bytes;
  }
  // Method to get current usage percentage
  async getUsagePercentage() {
    const quota = await this.getQuota();
    return quota.usage / quota.limit * 100;
  }
};
var DriveStorageFullError = class extends Error {
  quota;
  constructor(message, quota) {
    super(message);
    this.name = "DriveStorageFullError";
    this.quota = quota;
  }
};
var driveService = new GoogleDriveService();

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const usersWithoutPassword = users2.map(({ password, ...user }) => user);
      res.json(usersWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const user = await storage.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/channels", async (req, res) => {
    try {
      const channels2 = await storage.getAllChannels();
      res.json(channels2);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/channels", async (req, res) => {
    try {
      const channelData = insertChannelSchema.parse(req.body);
      const channel = await storage.createChannel(channelData);
      res.json(channel);
    } catch (error) {
      res.status(400).json({ message: "Invalid channel data" });
    }
  });
  app2.get("/api/channels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const channel = await storage.getChannel(id);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }
      res.json(channel);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/users/:userId/channels", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const channels2 = await storage.getChannelsByUserId(userId);
      res.json(channels2);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/channels", async (req, res) => {
    try {
      const channelData = insertChannelSchema.parse(req.body);
      const channel = await storage.createChannel(channelData);
      res.json(channel);
    } catch (error) {
      res.status(400).json({ message: "Invalid channel data" });
    }
  });
  app2.patch("/api/channels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const channel = await storage.updateChannel(id, updateData);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }
      res.json(channel);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/videos", async (req, res) => {
    try {
      const { search } = req.query;
      let videos2;
      if (search) {
        videos2 = await storage.searchVideos(search);
      } else {
        videos2 = await storage.getAllVideos();
      }
      res.json(videos2);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/videos/trending", async (req, res) => {
    try {
      let videos2 = await storage.getAllVideos();
      const now = /* @__PURE__ */ new Date();
      const trendingVideos = videos2.filter((video) => {
        const hasTrendingTag = video.tags?.some((tag) => tag.toLowerCase().includes("trending"));
        const highEngagement = (video.viewCount || 0) > 500 || (video.likeCount || 0) > 25;
        const recentUpload = (now.getTime() - new Date(video.uploadedAt || now).getTime()) / (1e3 * 60 * 60 * 24) <= 30;
        return hasTrendingTag || highEngagement || recentUpload;
      }).map((video) => {
        const views = video.viewCount || 0;
        const likes = video.likeCount || 0;
        const dislikes = video.dislikeCount || 0;
        const uploadedAt = new Date(video.uploadedAt || now);
        const daysSinceUpload = Math.max(1, (now.getTime() - uploadedAt.getTime()) / (1e3 * 60 * 60 * 24));
        const engagementRatio = likes / Math.max(1, likes + dislikes);
        const viewVelocity = views / Math.max(1, daysSinceUpload);
        const likeVelocity = likes / Math.max(1, daysSinceUpload);
        const recencyBoost = Math.exp(-daysSinceUpload / 7);
        const qualityScore = Math.log(1 + views) * engagementRatio;
        const velocityScore = (viewVelocity + likeVelocity * 10) * recencyBoost;
        const viralityFactor = Math.pow(likes / Math.max(1, views), 0.3);
        const nexusScore = qualityScore * 0.4 + velocityScore * 0.4 + viralityFactor * 0.2;
        return { ...video, nexusScore, engagementRatio, viewVelocity };
      }).sort((a, b) => b.nexusScore - a.nexusScore).slice(0, 50);
      res.json(trendingVideos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending videos" });
    }
  });
  app2.get("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideo(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/channels/:channelId/videos", async (req, res) => {
    try {
      const channelId = parseInt(req.params.channelId);
      const videos2 = await storage.getVideosByChannelId(channelId);
      res.json(videos2);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/videos", async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(videoData);
      res.json(video);
    } catch (error) {
      res.status(400).json({ message: "Invalid video data" });
    }
  });
  app2.post("/api/videos/upload", async (req, res) => {
    try {
      const { title, description, channelId, thumbnail, videoFile, fileSize } = req.body;
      if (!title || !channelId || !videoFile || !fileSize) {
        return res.status(400).json({
          message: "Missing required fields: title, channelId, videoFile, and fileSize"
        });
      }
      const quota = await driveService.getQuota();
      if (fileSize > quota.remaining) {
        return res.status(413).json({
          error: "STORAGE_FULL",
          message: `Google Drive storage is full. Need ${Math.round(fileSize / (1024 * 1024))}MB but only ${Math.round(quota.remaining / (1024 * 1024))}MB available.`,
          quota: {
            total: Math.round(quota.limit / (1024 * 1024 * 1024) * 100) / 100 + "GB",
            used: Math.round(quota.usage / (1024 * 1024 * 1024) * 100) / 100 + "GB",
            remaining: Math.round(quota.remaining / (1024 * 1024 * 1024) * 100) / 100 + "GB",
            usagePercentage: Math.round(quota.usage / quota.limit * 100)
          }
        });
      }
      const videoBuffer = Buffer.alloc(fileSize);
      try {
        const driveFile = await driveService.uploadVideo(
          `${title.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}.mp4`,
          videoBuffer,
          "video/mp4"
        );
        const videoData = {
          title,
          description: description || null,
          channelId: parseInt(channelId),
          thumbnail: thumbnail || `/api/placeholder/480/270?text=${encodeURIComponent(title)}`,
          videoUrl: driveFile.downloadUrl,
          driveFileId: driveFile.id,
          fileSize: driveFile.size,
          duration: Math.floor(Math.random() * 600) + 60,
          // Random duration 1-10 minutes
          uploadStatus: "completed"
        };
        const video = await storage.createVideo(videoData);
        res.json({
          success: true,
          video,
          driveFile: {
            id: driveFile.id,
            size: driveFile.size,
            webViewLink: driveFile.webViewLink
          },
          quota: {
            used: Math.round(quota.usage / (1024 * 1024 * 1024) * 100) / 100 + "GB",
            remaining: Math.round((quota.remaining - fileSize) / (1024 * 1024 * 1024) * 100) / 100 + "GB"
          }
        });
      } catch (driveError) {
        if (driveError instanceof DriveStorageFullError) {
          return res.status(413).json({
            error: "STORAGE_FULL",
            message: driveError.message,
            quota: {
              total: Math.round(driveError.quota.limit / (1024 * 1024 * 1024) * 100) / 100 + "GB",
              used: Math.round(driveError.quota.usage / (1024 * 1024 * 1024) * 100) / 100 + "GB",
              remaining: Math.round(driveError.quota.remaining / (1024 * 1024 * 1024) * 100) / 100 + "GB",
              usagePercentage: Math.round(driveError.quota.usage / driveError.quota.limit * 100)
            }
          });
        }
        throw driveError;
      }
    } catch (error) {
      console.error("Video upload error:", error);
      res.status(500).json({
        error: "UPLOAD_FAILED",
        message: "Failed to upload video. Please try again."
      });
    }
  });
  app2.get("/api/drive/quota", async (req, res) => {
    try {
      const quota = await driveService.getQuota();
      const usagePercentage = await driveService.getUsagePercentage();
      res.json({
        total: Math.round(quota.limit / (1024 * 1024 * 1024) * 100) / 100 + "GB",
        used: Math.round(quota.usage / (1024 * 1024 * 1024) * 100) / 100 + "GB",
        remaining: Math.round(quota.remaining / (1024 * 1024 * 1024) * 100) / 100 + "GB",
        usagePercentage: Math.round(usagePercentage),
        isNearlyFull: usagePercentage > 85,
        isFull: quota.remaining < 100 * 1024 * 1024
        // Less than 100MB remaining
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get storage quota" });
    }
  });
  app2.post("/api/drive/simulate-storage", async (req, res) => {
    try {
      const { increaseGB } = req.body;
      const increaseBytes = (increaseGB || 1) * 1024 * 1024 * 1024;
      await driveService.simulateStorageIncrease(increaseBytes);
      const quota = await driveService.getQuota();
      const usagePercentage = await driveService.getUsagePercentage();
      res.json({
        message: `Simulated ${increaseGB || 1}GB storage increase`,
        quota: {
          total: Math.round(quota.limit / (1024 * 1024 * 1024) * 100) / 100 + "GB",
          used: Math.round(quota.usage / (1024 * 1024 * 1024) * 100) / 100 + "GB",
          remaining: Math.round(quota.remaining / (1024 * 1024 * 1024) * 100) / 100 + "GB",
          usagePercentage: Math.round(usagePercentage),
          isNearlyFull: usagePercentage > 85,
          isFull: quota.remaining < 100 * 1024 * 1024
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to simulate storage increase" });
    }
  });
  app2.patch("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const video = await storage.updateVideo(id, updateData);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/users/:userId/subscriptions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const subscriptions2 = await storage.getSubscriptionsByUserId(userId);
      res.json(subscriptions2);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/subscriptions", async (req, res) => {
    try {
      const subscriptionData = insertSubscriptionSchema.parse(req.body);
      const existing = await storage.getSubscription(
        subscriptionData.subscriberId,
        subscriptionData.channelId
      );
      if (existing) {
        return res.status(400).json({ message: "Already subscribed" });
      }
      const subscription = await storage.createSubscription(subscriptionData);
      res.json(subscription);
    } catch (error) {
      res.status(400).json({ message: "Invalid subscription data" });
    }
  });
  app2.delete("/api/subscriptions/:subscriberId/:channelId", async (req, res) => {
    try {
      const subscriberId = parseInt(req.params.subscriberId);
      const channelId = parseInt(req.params.channelId);
      const deleted = await storage.deleteSubscription(subscriberId, channelId);
      if (!deleted) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      res.json({ message: "Unsubscribed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/videos/:videoId/comments", async (req, res) => {
    try {
      const videoId = parseInt(req.params.videoId);
      const comments2 = await storage.getCommentsByVideoId(videoId);
      res.json(comments2);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });
  app2.post("/api/video-views", async (req, res) => {
    try {
      const viewData = insertVideoViewSchema.parse(req.body);
      const view = await storage.createVideoView(viewData);
      const video = await storage.getVideo(viewData.videoId);
      if (video) {
        const newViewCount = (video.viewCount || 0) + 1;
        await storage.updateVideo(viewData.videoId, {
          viewCount: newViewCount
        });
        const now = /* @__PURE__ */ new Date();
        const daysSinceUpload = Math.max(1, (now.getTime() - new Date(video.uploadedAt || now).getTime()) / (1e3 * 60 * 60 * 24));
        const viewVelocity = newViewCount / daysSinceUpload;
        res.json({
          ...view,
          newViewCount,
          viewVelocity,
          engagementBoost: viewVelocity > 100 ? "high" : viewVelocity > 50 ? "medium" : "normal"
        });
      } else {
        res.json(view);
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid view data" });
    }
  });
  app2.get("/api/channels/:channelId/realtime-stats", async (req, res) => {
    try {
      const channelId = parseInt(req.params.channelId);
      const channel = await storage.getChannel(channelId);
      const videos2 = await storage.getVideosByChannelId(channelId);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }
      const totalViews = videos2.reduce((sum, video) => sum + (video.viewCount || 0), 0);
      const totalLikes = videos2.reduce((sum, video) => sum + (video.likeCount || 0), 0);
      const avgEngagement = videos2.length > 0 ? totalLikes / Math.max(1, totalViews) : 0;
      res.json({
        subscriberCount: channel.subscriberCount,
        totalViews,
        totalLikes,
        videoCount: videos2.length,
        avgEngagement: Math.round(avgEngagement * 1e4) / 100,
        // Percentage
        isGrowing: channel.subscriberCount > 1e3,
        status: "live"
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/video-likes", async (req, res) => {
    try {
      const likeData = insertVideoLikeSchema.parse(req.body);
      const existing = await storage.getVideoLike(likeData.videoId, likeData.userId);
      if (existing) {
        if (existing.isLike === likeData.isLike) {
          await storage.deleteVideoLike(likeData.videoId, likeData.userId);
          return res.json({ message: "Removed" });
        } else {
          const updated = await storage.updateVideoLike(
            likeData.videoId,
            likeData.userId,
            likeData.isLike
          );
          return res.json(updated);
        }
      }
      const like = await storage.createVideoLike(likeData);
      res.json(like);
    } catch (error) {
      res.status(400).json({ message: "Invalid like data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
