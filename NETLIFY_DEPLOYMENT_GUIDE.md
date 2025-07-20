# VideoNexus - Netlify Deployment Guide

## Quick Deploy Steps

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Copy files to dist folder**
   ```bash
   cp index.html dist/
   cp favicon.svg dist/
   cp -r public/* dist/
   ```

3. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `dist` folder to deploy
   - Or connect your GitHub repository

## Project Structure for Netlify

```
VideoNexus/
├── index.html              # Main entry point (required in root for Netlify)
├── favicon.svg             # Site icon
├── netlify.toml           # Netlify configuration
├── public/
│   └── _redirects         # SPA routing redirects
├── dist/                  # Build output folder
│   ├── index.html         # Copied from root
│   ├── assets/           # Bundled CSS/JS files
│   └── favicon.svg       # Copied favicon
├── client/               # React frontend source
├── server/               # Backend source (not deployed to Netlify)
└── shared/              # Shared types and schemas
```

## Netlify Configuration Features

### Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 20

### Redirects
- SPA routing: All routes redirect to `/index.html`
- API routes: Redirect to serverless functions (if used)

### Headers
- Security headers (XSS protection, frame options)
- Cache control for static assets
- Performance optimizations

## Environment Variables

For production deployment, set these environment variables in Netlify:

```
NODE_ENV=production
VITE_API_URL=https://your-api-domain.com
```

## Frontend-Only Deployment

This configuration deploys only the frontend React application to Netlify. The backend (`server/` folder) would need to be deployed separately to a service like:

- Heroku
- Vercel (serverless functions)
- Railway
- DigitalOcean
- AWS

## Development vs Production

- **Development**: Full-stack with both frontend and backend
- **Production**: Frontend-only on Netlify, backend deployed elsewhere

## Static Assets

All assets are bundled by Vite and placed in the `dist/assets/` folder with optimized filenames for caching.

## Performance Features

- Code splitting
- Asset optimization
- Gzip compression
- CDN distribution via Netlify
- Immutable cache headers for assets