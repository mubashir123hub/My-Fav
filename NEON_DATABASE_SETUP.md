# 🗄️ Neon Database Setup Guide for VideoNexus

## Step 1: Create Neon Account & Database

### 1.1 Sign Up for Neon
1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign up with your email or GitHub account
3. Verify your email if needed

### 1.2 Create Your First Project
1. Click "Create Project" 
2. **Project Name**: `VideoNexus` or `youtube-clone`
3. **Database Name**: `videonexus_db`
4. **Region**: Choose closest to your users (US East, EU West, etc.)
5. Click "Create Project"

## Step 2: Get Your Database Connection String

### 2.1 Find Connection Details
1. In your Neon dashboard, go to "Connection Details"
2. Copy the **Database URL** - it looks like:
   ```
   postgresql://username:password@host/database?sslmode=require
   ```

### 2.2 For VideoNexus Project
1. In your Replit project, add this URL to your environment variables
2. The variable should be named `DATABASE_URL`

## Step 3: Set Up Your Database Schema

Your VideoNexus project already has the schema ready! Just run:

```bash
npm run db:push
```

This will create all these tables:
- `users` - User accounts and profiles
- `channels` - Creator channels
- `videos` - Video content and metadata
- `subscriptions` - User-channel subscriptions
- `comments` - Video comments
- `video_views` - View tracking
- `video_likes` - Like/dislike system

## Step 4: Managing Your Neon Database

### 4.1 Using Neon Console
- **SQL Editor**: Run queries directly in the browser
- **Tables**: View and edit table data
- **Metrics**: Monitor database performance
- **Backups**: Automatic daily backups included

### 4.2 Common Management Tasks

#### View All Users
```sql
SELECT id, username, email, display_name, subscriber_count 
FROM users 
ORDER BY created_at DESC;
```

#### Check Video Statistics
```sql
SELECT v.title, v.view_count, v.like_count, c.name as channel_name
FROM videos v 
JOIN channels c ON v.channel_id = c.id 
ORDER BY v.view_count DESC 
LIMIT 10;
```

#### Monitor Database Size
```sql
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public';
```

### 4.3 Backup & Recovery
- **Automatic Backups**: Neon creates daily backups automatically
- **Point-in-Time Recovery**: Restore to any point in the last 7 days
- **Branch Creation**: Create database branches for testing

## Step 5: Production Best Practices

### 5.1 Environment Variables
Set these in your production environment:
```
DATABASE_URL=your_neon_connection_string
PGHOST=your_neon_host
PGDATABASE=your_database_name
PGUSER=your_username
PGPASSWORD=your_password
PGPORT=5432
```

### 5.2 Connection Pooling
Neon handles connection pooling automatically, but for high traffic:
- Use connection limits in your app
- Consider PgBouncer for additional pooling

### 5.3 Security
- Never commit DATABASE_URL to version control
- Use environment variables only
- Enable SSL connections (included by default)
- Regularly rotate passwords

## Step 6: Monitoring & Scaling

### 6.1 Monitor Performance
- Check query performance in Neon console
- Monitor connection counts
- Watch for slow queries

### 6.2 Scaling Options
- **Free Tier**: 0.5 GB storage, 1 database
- **Pro Plan**: More storage, multiple databases, longer backups
- **Auto-scaling**: Neon scales compute automatically

## Step 7: Troubleshooting

### Common Issues:

#### Connection Errors
```
Error: getaddrinfo ENOTFOUND
```
**Solution**: Check your DATABASE_URL format and network connection

#### SSL Errors
```
Error: no pg_hba.conf entry
```
**Solution**: Add `?sslmode=require` to your connection string

#### Schema Sync Issues
```
Error: relation does not exist
```
**Solution**: Run `npm run db:push` to sync schema changes

## Quick Commands for VideoNexus

```bash
# Push schema changes
npm run db:push

# Generate migrations (if needed)
npm run db:generate

# View database in browser
# Use Neon console at console.neon.tech
```

## Need Help?

1. **Neon Documentation**: [neon.tech/docs](https://neon.tech/docs)
2. **Discord Support**: Join Neon Discord community
3. **GitHub Issues**: For VideoNexus-specific problems

Your VideoNexus project is now ready to use a production-grade PostgreSQL database with Neon! 🚀