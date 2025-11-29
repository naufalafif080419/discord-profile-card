# Deployment Guide

This guide provides detailed instructions for deploying the Discord Profile Card Generator to various hosting platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Manual Static Hosting](#manual-static-hosting)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. **Node.js 18+** installed
2. **Git** installed and configured
3. **GitHub account** (for automatic deployments)
4. Account on your chosen hosting platform

## Vercel Deployment

Vercel is the recommended platform for Next.js applications and offers the easiest deployment experience.

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/discord-profile-card.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Deploy**
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Vercel Configuration

The project includes `vercel.json` with optimal settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "framework": "nextjs"
}
```

**No environment variables needed** - all APIs are public.

## Netlify Deployment

### Option 1: GitHub Integration

1. **Push to GitHub** (same as Vercel step 1)

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `18` (set in Environment variables)

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live at `https://your-project.netlify.app`

### Option 2: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=out
   ```

### Netlify Configuration

Create `netlify.toml` in the root:

```toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Cloudflare Pages Deployment

1. **Push to GitHub** (same as Vercel step 1)

2. **Import to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to "Pages"
   - Click "Create a project"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - Framework preset: `Next.js (Static HTML Export)`
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node version: `18`

4. **Deploy**
   - Click "Save and Deploy"
   - Your site will be live at `https://your-project.pages.dev`

## GitHub Pages Deployment

GitHub Pages requires deploying to the `gh-pages` branch.

### Option 1: GitHub Actions (Recommended)

1. **Create GitHub Actions Workflow**

   Create `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run build
         - uses: actions/upload-pages-artifact@v1
           with:
             path: out

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v1
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Your site will be live at `https://yourusername.github.io/discord-profile-card`

### Option 2: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to gh-pages branch**
   ```bash
   npm install -g gh-pages
   gh-pages -d out
   ```

3. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Your site will be live at `https://yourusername.github.io/discord-profile-card`

**Note:** For GitHub Pages, you may need to set `basePath` in `next.config.js`:

```javascript
module.exports = {
  output: 'export',
  basePath: '/discord-profile-card', // Your repository name
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}
```

## Manual Static Hosting

You can deploy the static files to any static hosting service.

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload the `out/` directory**
   - Upload all files from the `out/` directory to your hosting service
   - Ensure the hosting service supports:
     - Static file serving
     - SPA routing (redirects all routes to `index.html`)

### Supported Services

- **AWS S3 + CloudFront**
- **Google Cloud Storage**
- **Azure Static Web Apps**
- **Firebase Hosting**
- **Surge.sh**
- **Any static file hosting service**

## Troubleshooting

### Build Fails

**Issue:** Build fails with TypeScript errors
- **Solution:** Run `npm run build` locally to identify and fix errors before deploying

**Issue:** Build fails with module not found
- **Solution:** Ensure `node_modules` is installed: `npm install`

### Static Export Issues

**Issue:** Routes return 404
- **Solution:** Ensure your hosting service is configured to redirect all routes to `index.html` (SPA mode)

**Issue:** Images not loading
- **Solution:** Verify `images.unoptimized: true` in `next.config.js` (required for static export)

### API Issues

**Issue:** Profile data not loading
- **Solution:** Ensure the Discord user has joined the required Discord servers:
  - [Lanyard Discord](https://discord.gg/N4hGYDvWBy)
  - [Lantern Discord](https://discord.com/invite/ZayKFnDtRT)

**Issue:** RAWG API not working
- **Solution:** Verify the API key is correctly entered and stored in localStorage (check browser console)

### Performance Issues

**Issue:** Slow loading times
- **Solution:** 
  - Enable caching on your hosting service
  - Use a CDN (Vercel, Netlify, and Cloudflare all include CDN)
  - Check bundle size (should be ~119KB first load)

## Post-Deployment Checklist

- [ ] Verify the site loads correctly
- [ ] Test profile card generation with a Discord ID
- [ ] Test all customization options
- [ ] Verify embed code generation works
- [ ] Test on mobile devices
- [ ] Check browser console for errors
- [ ] Verify API integrations are working
- [ ] Test RAWG API integration (if using)
- [ ] Set up custom domain (optional)
- [ ] Configure HTTPS (should be automatic on most platforms)

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

### Cloudflare Pages
1. Go to Pages → Your Project → Custom Domains
2. Add custom domain
3. Configure DNS in Cloudflare

## Support

For deployment issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review platform-specific documentation
3. Open an issue on GitHub

---

**Happy Deploying! 🚀**

