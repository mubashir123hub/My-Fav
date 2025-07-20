# 🔄 Replace Database with Your Own Neon DB

## Quick Steps to Connect Your Database

### 1. Get Your Neon Connection String
From your Neon console, copy the connection string that looks like:
```
postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
```

### 2. Update VideoNexus Environment
**In Replit:**
1. Click the **Lock icon** (Secrets) in your project
2. Find `DATABASE_URL` 
3. **Replace the value** with your Neon connection string
4. Save the changes

**For other deployments:**
Set the environment variable:
```bash
export DATABASE_URL="your_neon_connection_string"
```

### 3. Set Up Tables in Your Database
```bash
npm run db:push
```

This creates all VideoNexus tables in YOUR database:
- users, channels, videos, comments, subscriptions, etc.

### 4. Test the Connection
```bash
# Verify connection works
npm run db:push

# Check if working
echo "Database connected successfully!"
```

## That's It!

Your VideoNexus app will now use YOUR Neon database instead of the default one. All user signups, video uploads, and data will go to your database.

## Want to Add Sample Data?
Run these in your Neon console to get started:

```sql
INSERT INTO users (username, email, password, display_name) 
VALUES ('testuser', 'test@example.com', 'password123', 'Test User');

INSERT INTO channels (user_id, name, description) 
VALUES (1, 'My Channel', 'My awesome channel');
```

Your own Neon database is now powering VideoNexus!