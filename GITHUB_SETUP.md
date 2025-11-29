# GitHub Repository Setup Guide

This guide will help you set up a GitHub repository for the Discord Profile Card Generator and connect it to Vercel for automatic deployments.

## Step 1: Create GitHub Repository

1. **Go to GitHub**
   - Visit [github.com](https://github.com)
   - Sign in to your account

2. **Create New Repository**
   - Click the "+" icon in the top right
   - Select "New repository"
   - Repository name: `discord-profile-card` (or your preferred name)
   - Description: "A modern Next.js application for generating Discord profile presence cards"
   - Visibility: Choose Public or Private
   - **Do NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

## Step 2: Initialize Git and Push Code

If you haven't initialized Git yet:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Discord Profile Card Generator"

# Add remote repository (replace with your repository URL)
git remote add origin https://github.com/yourusername/discord-profile-card.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

If Git is already initialized:

```bash
# Check current status
git status

# Add all files
git add .

# Commit changes
git commit -m "feat: complete deployment preparation"

# Push to GitHub
git push origin main
```

## Step 3: Verify Repository

1. **Check Repository**
   - Go to your repository on GitHub
   - Verify all files are present
   - Check that `.gitignore` is working (node_modules should not be visible)

2. **Verify Structure**
   - Ensure `README.md` is visible
   - Check that `package.json` exists
   - Verify `next.config.js` is present

## Step 4: Connect to Vercel

1. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Select your repository: `discord-profile-card`

2. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `out` (auto-detected)
   - Install Command: `npm install` (auto-detected)

3. **Environment Variables**
   - **No environment variables needed** - all APIs are public
   - Click "Deploy" without adding any variables

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 1-2 minutes)
   - Your site will be live at `https://your-project.vercel.app`

## Step 5: Enable Automatic Deployments

Vercel automatically deploys on every push to the main branch:

1. **Make a change**
   ```bash
   # Make any small change
   echo "# Test" >> README.md
   git add README.md
   git commit -m "test: verify auto-deployment"
   git push origin main
   ```

2. **Check Vercel Dashboard**
   - Go to your Vercel project
   - You should see a new deployment starting automatically
   - Wait for it to complete

## Step 6: Set Up Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Configure DNS**
   - Add CNAME record pointing to Vercel
   - Wait for DNS propagation (can take up to 24 hours)

## Troubleshooting

### Git Push Fails

**Issue:** `fatal: remote origin already exists`
```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/yourusername/discord-profile-card.git
```

**Issue:** Authentication failed
```bash
# Use GitHub CLI or SSH keys
# Or use Personal Access Token
git remote set-url origin https://YOUR_TOKEN@github.com/yourusername/discord-profile-card.git
```

### Vercel Deployment Fails

**Issue:** Build fails
- Check Vercel build logs
- Ensure `package.json` has correct scripts
- Verify `next.config.js` is correct

**Issue:** Module not found
- Check that all dependencies are in `package.json`
- Run `npm install` locally to verify

## Next Steps

After setting up GitHub and Vercel:

1. ✅ Your site is live and automatically deploying
2. ✅ Share your live URL with others
3. ✅ Make changes and push - they'll deploy automatically
4. ✅ Monitor deployments in Vercel dashboard

## Useful Commits

Here are some suggested commit messages for your deployment:

```bash
# Initial setup
git commit -m "feat: initial Discord Profile Card Generator"

# Features
git commit -m "feat: add RAWG API integration for enhanced game images"
git commit -m "feat: add Hero section and improved UI/UX"
git commit -m "feat: add Settings Accordion with progressive disclosure"

# Documentation
git commit -m "docs: update README with complete feature list"
git commit -m "docs: add comprehensive deployment guide"

# Configuration
git commit -m "config: add Vercel deployment configuration"
git commit -m "config: add GitHub Actions workflow"

# Bug fixes
git commit -m "fix: resolve TypeScript build errors"
git commit -m "fix: add Suspense boundary for static export"
```

## Repository Best Practices

1. **Keep commits focused** - One feature or fix per commit
2. **Write clear commit messages** - Use conventional commits format
3. **Use branches for features** - Create feature branches for major changes
4. **Review before merging** - Use pull requests for code review
5. **Keep main branch stable** - Only merge tested, working code

---

**Your repository is now set up and ready for deployment! 🚀**

