import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  subscriberCount: integer("subscriber_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  banner: text("banner"),
  avatar: text("avatar"),
  subscriberCount: integer("subscriber_count").default(0),
  videoCount: integer("video_count").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  channelId: integer("channel_id").references(() => channels.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail").notNull(),
  videoUrl: text("video_url").notNull(),
  driveFileId: text("drive_file_id"), // Google Drive file ID
  fileSize: integer("file_size"), // File size in bytes
  duration: integer("duration").notNull(), // in seconds
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  dislikeCount: integer("dislike_count").default(0),
  tags: text("tags").array(),
  category: text("category"),
  isPublic: boolean("is_public").default(true),
  uploadStatus: text("upload_status").default("processing"), // processing, completed, failed
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  subscriberId: integer("subscriber_id").references(() => users.id).notNull(),
  channelId: integer("channel_id").references(() => channels.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  likeCount: integer("like_count").default(0),
  parentId: integer("parent_id"), // for replies
  createdAt: timestamp("created_at").defaultNow(),
});

export const videoViews = pgTable("video_views", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  ipAddress: text("ip_address"),
  watchTime: integer("watch_time").default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const videoLikes = pgTable("video_likes", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  isLike: boolean("is_like").notNull(), // true for like, false for dislike
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  subscriberCount: true,
  createdAt: true,
});

export const insertChannelSchema = createInsertSchema(channels).omit({
  id: true,
  subscriberCount: true,
  videoCount: true,
  createdAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  viewCount: true,
  likeCount: true,
  dislikeCount: true,
  uploadedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  likeCount: true,
  createdAt: true,
});

export const insertVideoViewSchema = createInsertSchema(videoViews).omit({
  id: true,
  createdAt: true,
});

export const insertVideoLikeSchema = createInsertSchema(videoLikes).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Channel = typeof channels.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type VideoView = typeof videoViews.$inferSelect;
export type InsertVideoView = z.infer<typeof insertVideoViewSchema>;

export type VideoLike = typeof videoLikes.$inferSelect;
export type InsertVideoLike = z.infer<typeof insertVideoLikeSchema>;
