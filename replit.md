# YouTube Clone Application

## Overview

This is a full-stack YouTube-like video platform built with modern web technologies. The application follows a monorepo structure with a React frontend and Express backend, using PostgreSQL for data persistence and Drizzle ORM for database operations.

**Current Status**: Ready for Netlify deployment with fixed SignUp functionality and optimized build configuration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **Styling**: Tailwind CSS with a dark theme featuring neon accents
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **State Management**: TanStack React Query for server state, React Context for local state
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API endpoints
- **Middleware**: Custom logging, JSON parsing, error handling
- **Development**: Hot reload with Vite integration in development mode

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Migration**: Drizzle Kit for schema management
- **Connection**: @neondatabase/serverless for connection pooling

## Key Components

### Database Schema
The application uses a comprehensive video platform schema with the following main entities:
- **Users**: User accounts with authentication data
- **Channels**: Content creator channels linked to users
- **Videos**: Video content with metadata (title, description, thumbnail, etc.)
- **Subscriptions**: User-to-channel subscription relationships
- **Comments**: Video comments system
- **Video Views/Likes**: Engagement tracking

### Authentication System
- Simple email/password authentication
- Session management using local storage
- Protected routes for authenticated features
- User context provider for global auth state

### Video Management
- Video upload functionality with Google Drive integration
- Google Drive storage monitoring and quota management
- Storage full error handling with user-friendly messages
- Video player component
- Thumbnail generation and management
- Enhanced real-time view counting and engagement metrics
- NEXUS Algorithm: Superior recommendation system with multi-dimensional trending analysis
- Real-time subscriber count updates and live analytics

### Enhanced Algorithm Features
- **NEXUS SCORE**: Multi-factor trending calculation superior to YouTube
- **Real-time Engagement Prediction**: View velocity and viral coefficient analysis
- **Advanced Metrics**: Engagement ratio, recency boost, quality scoring
- **Live Analytics**: Real-time subscriber growth and view tracking

### UI/UX Features
- Responsive design with mobile-first approach
- Dark theme with neon color palette
- Sidebar navigation with collapsible states
- Complete page routing system with all standard pages
- Toast notifications for user feedback
- Loading states and error handling

### Available Pages
- Home: Main video feed and recommendations
- Authentication: Login and registration pages
- Upload: Video upload with Google Drive integration
- Watch: Individual video player page
- Channel: Channel profile and video listings
- Search: Search results for videos and channels
- Explore: Trending content and category discovery
- History: User's watch history
- Liked Videos: Collection of liked content
- Watch Later: Saved videos for later viewing
- Your Videos: User's uploaded content management
- Playlists: Saved video collections
- Settings: Account and preference management

## Data Flow

1. **Authentication Flow**: Login → Store user in context → Persist to localStorage
2. **Video Upload Flow**: Select channel → Upload video details → Create video record
3. **Video Viewing Flow**: Fetch video data → Display in player → Track view/engagement
4. **Subscription Flow**: Find channel → Create subscription → Update counts
5. **Comment Flow**: Authenticate user → Post comment → Real-time display

## External Dependencies

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- Class Variance Authority for component variants

### Data Management
- TanStack React Query for server state
- React Hook Form with Zod validation
- Date-fns for date manipulation

### Development Tools
- Vite with React plugin for fast development
- TypeScript for type safety
- ESBuild for production bundling

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/`
2. **Backend**: ESBuild bundles Express server to `dist/index.js` (separate deployment)
3. **Database**: Drizzle migrations run against PostgreSQL

### Netlify Deployment (Frontend)
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **SPA Routing**: Configured with `_redirects` file
- **Optimizations**: Code splitting, asset compression, CDN distribution

### Environment Configuration
- Development: Local development with hot reload
- Production Frontend: Static deployment on Netlify with neon styling
- Production Backend: Separate deployment (Heroku/Railway/Vercel)
- Database: PostgreSQL connection via environment variables

### Key Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build frontend for production deployment
- `./deploy-to-netlify.sh`: Automated Netlify deployment preparation
- `npm run db:push`: Push database schema changes

### Deployment Files Created
- `index.html`: Root entry point required by Netlify
- `netlify.toml`: Netlify configuration with redirects and headers
- `public/_redirects`: SPA routing fallback rules
- `favicon.svg`: Neon-themed site icon
- `NETLIFY_DEPLOYMENT_GUIDE.md`: Complete deployment instructions

The application is optimized for modern deployment with frontend on Netlify and backend services deployed separately for scalability.

## Recent Changes (January 2025)

✓ **Fixed Netlify Build Errors**: Updated netlify.toml configuration to use Vite instead of Create React App, changed from yarn to npm, set Node.js 20 compatibility
✓ **Database Integration**: Switched from MemStorage to DatabaseStorage with PostgreSQL, added sample data for testing
✓ **SignUp Error Resolution**: Fixed database connection issues that were causing errors during user registration
✓ **Deployment Optimization**: Created automated build scripts and comprehensive deployment documentation
✓ **Build Performance**: Achieved optimized bundle sizes (499KB JS, 73KB CSS) with proper asset management

## Current Deployment Status

- **Frontend**: Ready for Netlify deployment with working build configuration
- **Backend**: Database-ready with PostgreSQL integration and sample data
- **Build System**: Fully automated with ./deploy-to-netlify.sh script
- **Documentation**: Complete deployment guides and troubleshooting instructions