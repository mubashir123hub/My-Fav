# 🔗 Connect Your Own Neon Database to VideoNexus

## Step 1: Get Your Neon Database URL

### From Your Neon Console:
1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your existing database project
3. Go to **"Connection Details"** or **"Dashboard"**
4. Copy the **Connection String** (it looks like this):
   ```
   postgresql://username:password@ep-xxxx-xxxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```

## Step 2: Add Your Database URL to VideoNexus

### Option A: Through Replit Secrets (Recommended)
1. In your Replit project, click the **Lock icon** (Secrets)
2. Add a new secret:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Neon connection string (paste the full URL)
3. Click "Add Secret"

### Option B: Environment Variables
If deploying elsewhere, set this environment variable:
```bash
DATABASE_URL=your_neon_connection_string_here
```

## Step 3: Set Up VideoNexus Tables in Your Database

Run this command to create all the tables VideoNexus needs:

```bash
npm run db:push
```

This will create these tables in your Neon database:
- `users` - User accounts and profiles
- `channels` - Creator channels
- `videos` - Video content and metadata
- `subscriptions` - User-channel relationships
- `comments` - Video comments system
- `video_views` - View tracking
- `video_likes` - Like/dislike system

## Step 4: Test the Connection

### Quick Test:
```bash
# This should show your database tables
npm run db:push
```

### Check Your Data:
You can run SQL queries in your Neon console to verify:
```sql
-- List all tables
\dt

-- Check if tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

## Step 5: Add Sample Data (Optional)

If you want some test data to start with:

```sql
-- Add sample users
INSERT INTO users (username, email, password, display_name, bio, is_verified, subscriber_count) VALUES 
('creator1', 'creator1@example.com', 'password123', 'Content Creator', 'Making awesome videos!', false, 1000),
('viewer1', 'viewer1@example.com', 'password123', 'Video Viewer', 'Love watching great content', false, 0);

-- Add sample channels
INSERT INTO channels (user_id, name, description, subscriber_count, video_count) VALUES 
(1, 'Creative Channel', 'Amazing creative content for everyone', 1000, 5);

-- Add sample video
INSERT INTO videos (channel_id, title, description, thumbnail, video_url, duration, view_count, like_count, category) VALUES 
(1, 'Welcome to VideoNexus', 'Introduction to our amazing platform', 'https://example.com/thumb.jpg', 'https://example.com/video.mp4', 300, 2500, 150, 'Education');
```

## Step 6: Update VideoNexus Configuration

The project is already configured to use your DATABASE_URL. No code changes needed!

## Troubleshooting

### Connection Issues:
- Make sure your DATABASE_URL includes `?sslmode=require`
- Check that your Neon database is not paused
- Verify the connection string is correct

### Permission Issues:
- Ensure your Neon database user has CREATE, INSERT, UPDATE, DELETE permissions
- Check that your Neon project is active (not sleeping)

### Schema Issues:
If tables don't create properly:
```bash
# Force schema refresh
npm run db:push
```

## Your Database is Ready!

Once connected, your VideoNexus app will use your own Neon database for:
- User registrations and logins
- Video uploads and metadata
- Comments and interactions
- View counts and analytics
- Channel subscriptions

Your existing Neon database is now powering VideoNexus!