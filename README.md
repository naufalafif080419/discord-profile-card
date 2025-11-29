# Discord Profile Card Generator

A modern, feature-rich Next.js application for generating beautiful Discord profile presence cards. Create stunning profile cards for your README, portfolio, or website with real-time updates and extensive customization options.

![Discord Profile Card Generator](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## ✨ Features

### Core Features
- ✅ **Real-time Discord Presence** - Live updates via Lanyard API (updates every 0.5-2 seconds)
- ✅ **Comprehensive Profile Data** - Rich profile information from dstn.to API (banners, badges, etc.)
- ✅ **Last Seen Information** - Platform status and last seen data from Lantern API
- ✅ **Activity Cards** - Beautiful rendering of Discord activities (games, streaming, etc.)
- ✅ **Spotify Integration** - Display currently playing Spotify tracks with album art
- ✅ **Badge Display** - Show Discord badges (Nitro, HypeSquad, Partner, etc.)
- ✅ **Guild Tags** - Display server tags and identity guild information
- ✅ **Custom Status** - Show custom Discord status messages

### UI/UX Features
- ✅ **Hero Section** - Animated landing page with floating profile card showcase
- ✅ **Progressive Disclosure** - Collapsible settings accordion for better organization
- ✅ **Loading States** - Skeleton screens and smooth loading animations
- ✅ **Toast Notifications** - User-friendly feedback for actions (copy, errors, etc.)
- ✅ **Responsive Design** - Mobile-first design that works on all devices
- ✅ **Accessibility** - Skip links, ARIA labels, keyboard navigation support

### Customization Features
- ✅ **Color Schemes** - Default, Dark, Light, and Custom color themes
- ✅ **Display Name Styling** - 8 unique fonts and 5 effects (Solid, Gradient, Neon, Toon, Pop)
- ✅ **Display Options** - 9+ toggles to show/hide various profile elements
- ✅ **Banner Customization** - Custom banner URLs and image width settings
- ✅ **URL Parameters** - Shareable URLs with all customization options encoded

### Advanced Features
- ✅ **RAWG API Integration** - Enhanced game activity images (optional, user-provided API key)
- ✅ **Smart Caching** - Persistent localStorage cache for RAWG API (7-day cache, reduces API calls)
- ✅ **URL Generator** - Export embed code in Markdown, HTML, or URL formats
- ✅ **Live Preview** - Real-time iframe preview with dynamic height adjustment
- ✅ **Static Export** - Fully configured for static hosting (Vercel, Netlify, etc.)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Discord account (to test with your profile)
- (Optional) RAWG API key for enhanced game images ([Get one here](https://rawg.io/apidocs))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd discord

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build static files
npm run build
```

The static files will be in the `out/` directory, ready for deployment.

## 📖 Usage Examples

### Basic Usage

1. Enter your Discord User ID in the input field
2. Customize appearance, colors, and display options
3. Copy the generated embed code from the "Export & Share" section

### URL Parameters

The generator supports extensive URL parameters for sharing customized profiles:

```bash
# Basic profile
/embed?id=915480322328649758

# With color scheme
/embed?id=915480322328649758&colorScheme=dark

# With custom colors
/embed?id=915480322328649758&colorScheme=custom&primaryColor=8180ff&accentColor=fe80c0

# With display name styling
/embed?id=915480322328649758&displayNameFont=gg-sans&displayNameEffect=gradient&displayNameGradientStart=FF6B9D&displayNameGradientEnd=FFB3D9

# Hide specific elements
/embed?id=915480322328649758&hideSpotify=1&hideBadges=1&hideActivityTime=1
```

### Embed Code Examples

#### Markdown
```markdown
[![Discord Profile](https://your-domain.com/embed?id=915480322328649758)](https://discord.com/users/915480322328649758)
```

#### HTML
```html
<iframe 
  src="https://your-domain.com/embed?id=915480322328649758" 
  width="380" 
  height="600" 
  frameborder="0" 
  allowtransparency="true">
</iframe>
```

#### Direct URL
```
https://your-domain.com/embed?id=915480322328649758&colorScheme=dark&displayNameFont=gg-sans
```

### RAWG API Integration (Optional)

For enhanced game activity images:

1. Get a free API key from [RAWG.io](https://rawg.io/apidocs)
2. Enter your API key in the "RAWG API Key" section
3. The API key is stored securely in localStorage (never in URLs)
4. Game activities will automatically use higher-quality images from RAWG

**Note:** The RAWG API key is optional. Without it, the generator uses standard Discord CDN images.

## 🔌 API Integration

The application integrates with multiple APIs:

### 1. Lanyard API
- **Endpoint:** `https://api.lanyard.rest/v1/users/{userId}`
- **Purpose:** Real-time Discord presence data
- **Caching:** 5 seconds for initial loads, bypassed for real-time updates
- **Join Server:** [Lanyard Discord](https://discord.gg/N4hGYDvWBy)

### 2. dstn.to API
- **Endpoint:** `https://dcdn.dstn.to/profile/{userId}`
- **Purpose:** Comprehensive profile data (banners, badges, etc.)
- **Caching:** 5 minutes for initial loads

### 3. Lantern API
- **Endpoint:** `https://lantern.rest/api/v1/users/{userId}`
- **Purpose:** Last seen information and platform status
- **Caching:** 30 seconds for initial loads
- **Join Server:** [Lantern Discord](https://discord.com/invite/ZayKFnDtRT)

### 4. RAWG API (Optional)
- **Endpoint:** `https://api.rawg.io/api/games`
- **Purpose:** Enhanced game images and metadata
- **Caching:** 7 days (persistent localStorage cache)
- **Get API Key:** [RAWG.io](https://rawg.io/apidocs)

All API calls include intelligent caching to minimize requests and improve performance.

## 🏗️ Project Structure

```
discord/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with metadata
│   │   ├── page.tsx                # Main generator page
│   │   └── embed/
│   │       └── page.tsx            # Embed page (iframe target)
│   ├── components/
│   │   ├── ProfileCard.tsx         # Main Discord profile card
│   │   ├── ProfileHeader.tsx       # Profile header component
│   │   ├── Badges.tsx              # Badge display component
│   │   ├── GuildTags.tsx           # Guild tag component
│   │   ├── StatusIndicator.tsx     # Status indicator (online/idle/dnd/offline)
│   │   ├── SvgMasks.tsx            # SVG masks for status indicators
│   │   ├── BadgeTooltip.tsx        # Tooltip component for badges
│   │   ├── Hero.tsx                # Landing page hero section
│   │   ├── LoadingSkeleton.tsx     # Loading skeleton component
│   │   ├── Toast.tsx               # Toast notification component
│   │   ├── EntryFadeOverlay.tsx    # Entry fade animation
│   │   ├── Generator/              # Generator UI components
│   │   │   ├── UserIdInput.tsx     # User ID input field
│   │   │   ├── RawgApiKeyInput.tsx # RAWG API key input
│   │   │   ├── DisplayOptions.tsx  # Display toggle options
│   │   │   ├── AppearanceSettings.tsx # Color scheme settings
│   │   │   ├── DisplayNameStyle.tsx   # Font and effect settings
│   │   │   ├── ImageOptions.tsx    # Banner and image settings
│   │   │   ├── UrlGenerator.tsx    # URL/Markdown/HTML generator
│   │   │   └── SettingsAccordion.tsx # Collapsible settings
│   │   ├── Activities/              # Activity components
│   │   │   ├── ActivityCard.tsx    # Individual activity card
│   │   │   ├── ActivitySections.tsx # Activity sections organizer
│   │   │   └── SpotifyCard.tsx     # Spotify activity card
│   │   └── ui/                      # UI primitives
│   │       ├── input.tsx           # Input component
│   │       ├── label.tsx           # Label component
│   │       └── switch.tsx          # Switch/toggle component
│   ├── lib/
│   │   ├── api/                     # API clients
│   │   │   ├── lanyard.ts          # Lanyard API client
│   │   │   ├── dstn.ts             # dstn.to API client
│   │   │   ├── lantern.ts          # Lantern API client
│   │   │   ├── rawg.ts             # RAWG API client
│   │   │   └── common.ts           # Common API utilities
│   │   ├── types/                   # TypeScript type definitions
│   │   │   ├── lanyard.ts          # Lanyard API types
│   │   │   ├── dstn.ts             # dstn.to API types
│   │   │   ├── lantern.ts         # Lantern API types
│   │   │   ├── rawg.ts            # RAWG API types
│   │   │   └── discord.ts         # Discord-related types
│   │   └── utils/                   # Utility functions
│   │       ├── cache.ts            # Cache implementation (with localStorage)
│   │       ├── url.ts              # URL parameter parsing/building
│   │       ├── validation.ts       # Validation utilities
│   │       ├── formatting.ts       # Formatting utilities
│   │       └── profile.ts          # Profile data utilities
│   ├── hooks/                       # React hooks
│   │   ├── useAllRealTimeUpdates.ts # Real-time update hook
│   │   ├── useDiscordProfile.ts    # Discord profile hook
│   │   ├── useRawgGame.ts          # RAWG game data hook
│   │   ├── useUrlParams.ts         # URL params hook
│   │   └── useScrollReveal.ts     # Scroll reveal animation hook
│   └── styles/                      # CSS styles
│       ├── globals.css             # Global styles
│       └── styles.css              # Component styles
├── next.config.js                   # Next.js configuration (static export)
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## 🚢 Deployment

### Vercel (Recommended)

Vercel is the recommended deployment platform for Next.js applications.

#### Automatic Deployment (GitHub Integration)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build
4. Deploy! Your site will be live at `https://your-project.vercel.app`

#### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

#### Vercel Configuration

The project includes `vercel.json` for optimal configuration. No environment variables are required.

### Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `out/` directory to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `out`

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node version: `18` or higher

### GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Deploy the `out/` directory to the `gh-pages` branch
3. Configure GitHub Pages to serve from the `gh-pages` branch

**Note:** For GitHub Pages, you may need to set `basePath` in `next.config.js` if deploying to a subdirectory.

## 🔧 Configuration

### Next.js Configuration

The project is configured for static export in `next.config.js`:

```javascript
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}
```

### Environment Variables

No environment variables are required. All APIs are public, and the RAWG API key is user-provided (stored in localStorage).

## 🎨 Customization

### Color Schemes

- **Default** - Uses Discord's default colors
- **Dark** - Dark theme variant
- **Light** - Light theme variant
- **Custom** - User-defined primary and accent colors

### Display Name Effects

1. **Solid** - Solid color text
2. **Gradient** - Linear gradient (customizable start/end colors)
3. **Neon** - Glowing neon effect
4. **Toon** - Cartoon-style effect
5. **Pop** - Bold, vibrant effect

### Display Options

Toggle visibility of:
- Animated avatar decorations
- Server tags
- Spotify activity
- Display name
- Activity timestamps
- Badges
- Activities
- Recent activity
- Last seen status

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Credits

This project uses the following APIs and services:

- **[Lanyard](https://github.com/Phineas/lanyard)** - Discord presence API
- **[dstn.to](https://dcdn.dstn.to/)** - Discord profile data API
- **[Lantern](https://github.com/discordplace/lantern)** - Last seen and status API
- **[RAWG](https://rawg.io/)** - Video game database API (optional)

Special thanks to:
- [dustinrouillard](https://gist.github.com/dustinrouillard/04be36180ed80db144a4857408478854) - Formatting examples
- [dsc-readme](https://dsc-readme.tsuni.dev/) - Layout inspiration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ using Next.js, TypeScript, and React**
