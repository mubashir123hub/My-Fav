# 🛠️ Neon Database Management for VideoNexus

## Your Current Setup Status ✅

Your VideoNexus project is already connected to a Neon database! Here's how to manage it:

## Basic Management Commands

### 1. Check Database Connection
```bash
# Test if your database is working
npm run db:push
```

### 2. View Your Data
```sql
-- See all users
SELECT * FROM users LIMIT 10;

-- Check videos
SELECT title, view_count, like_count FROM videos ORDER BY view_count DESC;

-- Monitor channels
SELECT name, subscriber_count, video_count FROM channels;
```

### 3. Add Sample Data (if needed)
```sql
-- Add a test user
INSERT INTO users (username, email, password, display_name, bio) 
VALUES ('testuser', 'test@example.com', 'password123', 'Test User', 'Testing VideoNexus');

-- Create a test channel
INSERT INTO channels (user_id, name, description) 
VALUES (1, 'Test Channel', 'My awesome test channel');
```

## Database Maintenance

### Monitor Performance
```sql
-- Check database size
SELECT 
    pg_size_pretty(pg_database_size(current_database())) as database_size;

-- View table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Clean Up Data
```sql
-- Remove old video views (older than 30 days)
DELETE FROM video_views WHERE created_at < NOW() - INTERVAL '30 days';

-- Clean up test data
DELETE FROM users WHERE username LIKE 'test%';
```

## Backup & Recovery

### Create Manual Backup
1. Go to your Neon Console
2. Navigate to "Backups" section
3. Click "Create Backup"
4. Name it: `VideoNexus_backup_2025_01_20`

### Restore from Backup
1. In Neon Console, go to "Backups"
2. Select your backup
3. Click "Restore"
4. Choose restore method (new branch or overwrite)

## Production Deployment Steps

### 1. Update Environment Variables
For production deployment, set these in your hosting service:
```
DATABASE_URL=your_neon_connection_string
NODE_ENV=production
```

### 2. Run Schema Migration
```bash
# Push your schema to production database
npm run db:push
```

### 3. Populate Initial Data
```sql
-- Add essential data for your platform
INSERT INTO users (username, email, password, display_name, is_verified) 
VALUES ('admin', 'admin@videonexus.com', 'secure_password', 'VideoNexus Admin', true);
```

## Monitoring Your Database

### Key Metrics to Watch
1. **Connection Count**: Keep under your plan limit
2. **Storage Usage**: Monitor growth rate
3. **Query Performance**: Watch for slow queries
4. **Active Users**: Track user growth

### Performance Queries
```sql
-- Most viewed videos
SELECT v.title, v.view_count, c.name as channel_name
FROM videos v 
JOIN channels c ON v.channel_id = c.id 
ORDER BY v.view_count DESC 
LIMIT 20;

-- User engagement stats
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_users_week,
    AVG(subscriber_count) as avg_subscribers
FROM users;

-- Popular tags
SELECT 
    unnest(tags) as tag, 
    COUNT(*) as usage_count
FROM videos 
WHERE tags IS NOT NULL
GROUP BY tag 
ORDER BY usage_count DESC 
LIMIT 15;
```

## Troubleshooting Common Issues

### Connection Problems
```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"
```

### Schema Issues
```bash
# Reset and rebuild schema
npm run db:push
```

### Data Conflicts
```sql
-- Check for duplicate users
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;
```

## Quick Actions for VideoNexus

```bash
# Deploy schema changes
npm run db:push

# Check database status
psql $DATABASE_URL -c "\dt"

# View recent activity
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

Your Neon database is ready to power VideoNexus in production! 🚀