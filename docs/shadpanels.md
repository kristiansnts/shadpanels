# ShadPanel - Simple Admin Panel Generator

A simple CLI tool for generating modern admin panels in Next.js projects using shadcn/ui components.

## Overview

ShadPanel is a lightweight tool that helps you quickly create a clean, simple admin interface for your Next.js applications. It focuses on providing the essentials without over-engineering.

## Installation & Quick Start

### Recommended Usage (npx)

```bash
# Generate a simple admin panel
npx shadpanel init
```

### Alternative Usage (Package Scripts)

You can also add ShadPanel to your project's package.json:

```json
{
  "scripts": {
    "shadpanel": "shadpanel"
  }
}
```

Then use:
```bash
npm run shadpanel init
```

## What You Get

The admin panel provides a clean, simple administrative interface with essential features:

**Features:**
- User authentication and session management
- Clean admin dashboard
- Responsive layout with sidebar navigation
- Built with modern shadcn/ui components
- TypeScript support

**Generated Structure:**
```
app/admin/
├── layout.tsx              # Admin layout with sidebar
└── page.tsx                # Admin dashboard
app/login/
├── layout.tsx              # Login layout
└── page.tsx                # Login page
app/api/auth/
├── login/route.ts          # Login API
├── logout/route.ts         # Logout API
└── status/route.ts         # Auth status API
```

## Command Reference

### Core Commands

#### `init`
Initializes an admin panel in your Next.js project.

```bash
npx shadpanel init [options]
```

**Options:**
- `--force` - Overwrite existing files without prompting
- `--skip-deps` - Skip automatic dependency installation
- `--app-name <name>` - Set custom app name (default: "Admin Panel")

**Examples:**
```bash
# Basic setup
npx shadpanel init

# Custom configuration
npx shadpanel init --app-name "MyApp Admin" --force
```

### Global Options

- `--help, -h` - Show help information
- `--version, -v` - Show version number
- `--verbose` - Enable verbose logging
- `--dry-run` - Preview changes without writing files

## Project Structure After Generation

When you run ShadPanel, it will generate the following files directly into your Next.js project:

```
your-nextjs-project/
├── app/
│   ├── admin/                  # Admin panel routes
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   └── page.tsx            # Admin dashboard
│   ├── login/                  # Authentication pages
│   │   ├── layout.tsx          # Login layout
│   │   └── page.tsx            # Login page
│   └── api/
│       └── auth/               # Authentication API endpoints
│           ├── login/route.ts  # Login endpoint
│           ├── logout/route.ts # Logout endpoint
│           └── status/route.ts # Auth status check
├── components/
│   ├── ui/                     # Generated shadcn/ui components
│   │   ├── avatar.tsx          # User avatar component
│   │   ├── button.tsx          # Button component
│   │   ├── collapsible.tsx     # Collapsible component
│   │   ├── dialog.tsx          # Modal dialog component
│   │   ├── dropdown-menu.tsx   # Dropdown menu component
│   │   ├── label.tsx           # Form label component
│   │   ├── separator.tsx       # Visual separator component
│   │   └── tooltip.tsx         # Tooltip component
│   ├── app-header.tsx          # Generated header component
│   ├── app-sidebar.tsx         # Generated sidebar component
│   └── nav-main.tsx            # Generated navigation component
├── hooks/
│   ├── use-auth.ts             # Generated authentication hook
│   └── use-mobile.ts           # Generated mobile detection hook
├── lib/
│   ├── app-config.ts           # Generated app configuration
│   ├── auth.ts                 # Generated authentication utilities
│   └── utils.ts                # Generated utility functions
├── middleware.ts               # Generated authentication middleware
├── next.config.ts              # Generated Next.js config with rewrites
└── components.json             # Generated shadcn/ui configuration
```

**Important:** All components and configuration files are generated directly into your project, giving you full control to customize them as needed.

## How It Works

### Generated vs Installed Components

**Generated Files (Copied to Your Project):**
- All files listed in the structure above are generated directly into your project
- You have full ownership and can customize them as needed
- shadcn/ui components are copied into `components/ui/` for complete control
- Layout components, hooks, and utilities are generated as TypeScript files

**Installed Dependencies (via npm):**
ShadPanel automatically installs the following npm packages:

```json
{
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-collapsible": "^1.1.12",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-tooltip": "^1.2.8",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.539.0",
  "tailwind-merge": "^3.3.1"
}
```

This approach gives you the best of both worlds: working components that you can fully customize.

## Customization Guide

### App Configuration

You can customize your panel's branding and configuration in `lib/app-config.ts`:

```typescript
export function getAppName(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_APP_NAME || "Your Custom Name"
  }
  return process.env.APP_NAME || "Your Custom Name"
}

export function getDashboardTitle(): string {
  const appName = getAppName()
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_DASHBOARD_TITLE || `Dashboard - ${appName}`
  }
  return process.env.DASHBOARD_TITLE || `Dashboard - ${appName}`
}
```

### Navigation Customization

Modify the navigation structure in your admin layout file:

```typescript
// app/admin/layout.tsx
const navigation = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: "LayoutDashboard",
  },
  // Add your custom navigation items as you build features
]
```

### Component Customization

All generated components are fully customizable. You can modify them in:

- `components/ui/` - shadcn/ui base components
- `components/` - Shared layout components

### Styling Customization

Customize the appearance by modifying:

1. **Tailwind Configuration** - Update `tailwind.config.js`
2. **CSS Variables** - Modify `app/globals.css`
3. **Component Styles** - Update individual component files

## Authentication

ShadPanel includes a built-in authentication system with automatic route protection:

### How Authentication Works

1. **Route Protection**: The generated `middleware.ts` automatically protects `/admin/*` routes
2. **Login Redirect**: Unauthenticated users are redirected to `/admin/login` 
3. **URL Rewrite**: The `/admin/login` URL is rewritten to serve the `/login` page
4. **Session Management**: Once authenticated, users can access the admin panel

### Generated Authentication Flow

```typescript
// middleware.ts - Automatically generated
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuth = isAuthenticatedFromRequest(request)

  // Redirect unauthenticated admin users to login
  if (pathname.startsWith('/admin') && !isAuth) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login']
}
```

### URL Rewrite Configuration

The generated `next.config.ts` includes rewrite rules for clean URLs:

```typescript
// next.config.ts - Automatically generated
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/admin/login',    // User visits this URL
        destination: '/login',     // But sees this page
      },
    ];
  },
};
```

### Auth Configuration

Configure authentication in the generated `lib/auth.ts`:

```typescript
// Simple session-based auth (default)
export function authenticateUser(credentials: LoginCredentials): boolean {
  // Implement your authentication logic
  return credentials.username === "admin" && credentials.password === "password"
}

// Check authentication status
export function isAuthenticatedFromRequest(request: NextRequest): boolean {
  // Check your authentication tokens/sessions
  return request.cookies.has('auth-token')
}
```

### Custom Authentication

To integrate with external auth providers:

1. Update `lib/auth.ts` with your provider's logic
2. Modify API routes in `app/api/auth/`
3. Update the `useAuth` hook if needed

## Complete File Generation List

When you run `npx shadpanel init`, these files will be generated in your project:

**App Routes & Pages:**
- `app/admin/layout.tsx` - Admin layout with sidebar
- `app/admin/page.tsx` - Admin dashboard page  
- `app/login/layout.tsx` - Login page layout
- `app/login/page.tsx` - Login form page

**API Endpoints:**
- `app/api/auth/login/route.ts` - Login API endpoint
- `app/api/auth/logout/route.ts` - Logout API endpoint  
- `app/api/auth/status/route.ts` - Auth status check endpoint

**UI Components:**
- `components/ui/avatar.tsx` - User avatar component
- `components/ui/button.tsx` - Button component
- `components/ui/collapsible.tsx` - Collapsible component
- `components/ui/dialog.tsx` - Modal dialog component
- `components/ui/dropdown-menu.tsx` - Dropdown menu component
- `components/ui/label.tsx` - Form label component
- `components/ui/separator.tsx` - Visual separator component
- `components/ui/tooltip.tsx` - Tooltip component

**Layout Components:**
- `components/app-header.tsx` - Header with user menu
- `components/app-sidebar.tsx` - Sidebar navigation
- `components/nav-main.tsx` - Main navigation component

**Hooks:**
- `hooks/use-auth.ts` - Authentication state management
- `hooks/use-mobile.ts` - Mobile device detection

**Utilities & Config:**
- `lib/app-config.ts` - App configuration and branding
- `lib/auth.ts` - Authentication utilities
- `lib/utils.ts` - General utility functions
- `middleware.ts` - Route protection middleware
- `next.config.ts` - Next.js config with URL rewrites
- `components.json` - shadcn/ui configuration

## Examples

### Basic Setup

```bash
# Start with a fresh Next.js project
npx create-next-app@latest my-admin-app
cd my-admin-app

# Add an admin panel (generates all files above)
npx shadpanel init

# Start development
npm run dev
```

### Custom Branded Panel

```bash
# Create with custom branding
npx shadpanel init --app-name "MyCompany Admin"

# Set environment variables for dynamic branding
echo "NEXT_PUBLIC_APP_NAME=MyCompany Admin" >> .env.local
echo "NEXT_PUBLIC_DASHBOARD_TITLE=Admin Portal" >> .env.local
```

## Troubleshooting

### Common Issues

#### "Not a Next.js project"
**Problem:** ShadPanels requires a Next.js project with App Router.

**Solution:**
```bash
# Ensure you have these files:
# - next.config.js (or .ts)
# - app/ directory
# - package.json with Next.js dependency

# If migrating from Pages Router:
npx @next/codemod@latest app-router-migration .
```

#### "Port 3000 already in use"
**Problem:** Default Next.js development server port is occupied.

**Solution:**
```bash
# Run on different port
npm run dev -- -p 3001
```

#### "Missing dependencies"
**Problem:** Some required packages weren't installed automatically.

**Solution:**
```bash
# Manual installation
npm install @radix-ui/react-avatar @radix-ui/react-dropdown-menu lucide-react

# Or re-run with force flag
npx shadpanel init --force
```

#### "Tailwind CSS not working"
**Problem:** Styles not applying correctly.

**Solution:**
```bash
# Ensure Tailwind is properly configured
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Update tailwind.config.js content paths:
# content: ["./app/**/*.{js,ts,jsx,tsx}"]
```

### File Conflicts

When ShadPanel detects existing files, it will prompt you with options:

- **Overwrite**: Replace the existing file
- **Skip**: Keep the existing file unchanged  
- **Merge**: Attempt to merge configurations (for config files)
- **Rename**: Save the new file with a different name

Use `--force` flag to automatically overwrite all conflicts.

### Environment Variables

ShadPanel supports the following environment variables:

```bash
# App branding
NEXT_PUBLIC_APP_NAME="Your App Name"
NEXT_PUBLIC_DASHBOARD_TITLE="Custom Dashboard Title"

# Authentication (optional)
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Database (if using external auth)
DATABASE_URL="your-database-connection-string"
```

## Contributing

We welcome contributions to ShadPanel! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/shadpanel/issues)
- 📖 Documentation: Coming soon

## License

MIT License - see [LICENSE](../LICENSE) file for details.

---

<p align="center">Made with ❤️ for building simple admin panels</p>