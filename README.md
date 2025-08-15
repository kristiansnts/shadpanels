# ShadPanel

A CLI tool for generating modern admin panels in Next.js projects using shadcn/ui components.

[![npm version](https://badge.fury.io/js/shadpanel.svg)](https://badge.fury.io/js/shadpanel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **🎨 Modern UI**: Generates admin panels with shadcn/ui components
- **📱 Responsive**: Mobile-first design that works on all devices  
- **🔒 Authentication**: Built-in login/logout system with route protection
- **⚡ Fast Setup**: One command to add admin panel to existing Next.js projects
- **🛠️ Customizable**: Full control over generated components and styling
- **🔧 TypeScript**: Complete TypeScript support with type safety

## 🚀 Quick Start

### Installation

```bash
# Use with npx (recommended)
npx shadpanel init

# Or install globally
npm install -g shadpanel
shadpanel init
```

### Requirements

- Node.js 18+
- Next.js project with App Router
- Existing Next.js project (create one with `npx create-next-app@latest`)

### Usage

```bash
# Initialize admin panel in your Next.js project
npx shadpanel init

# With custom options
npx shadpanel init --app-name "MyApp Admin" --force

# Preview what will be generated (dry run)
npx shadpanel init --dry-run --verbose
```

## 📋 Command Reference

### `init`
Initialize an admin panel in your Next.js project.

```bash
npx shadpanel init [options]
```

**Options:**
- `--force` - Overwrite existing files without prompting
- `--skip-deps` - Skip automatic dependency installation  
- `--app-name <name>` - Set custom app name (default: "Admin Panel")
- `--dry-run` - Preview changes without writing files
- `--verbose` - Enable verbose logging
- `--help` - Show help for command

**Examples:**
```bash
# Basic setup
npx shadpanel init

# Custom configuration  
npx shadpanel init --app-name "MyCompany Admin" --force

# Preview changes
npx shadpanel init --dry-run --verbose
```

## 📁 What Gets Generated

ShadPanel generates a complete admin panel structure in your Next.js project:

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
│   ├── ui/                     # shadcn/ui components
│   │   ├── avatar.tsx          # User avatar component
│   │   ├── button.tsx          # Button component  
│   │   ├── card.tsx            # Card component
│   │   └── ...                 # Other UI components
│   ├── app-header.tsx          # Header with user menu
│   ├── app-sidebar.tsx         # Sidebar navigation
│   └── login-form.tsx          # Login form component
├── hooks/
│   ├── use-auth.ts             # Authentication hook
│   └── use-mobile.ts           # Mobile detection hook
├── lib/
│   ├── app-config.ts           # App configuration
│   ├── auth.ts                 # Authentication utilities
│   └── utils.ts                # Utility functions
├── middleware.ts               # Route protection middleware
├── next.config.ts              # Next.js config with rewrites
└── components.json             # shadcn/ui configuration
```

## 🎨 Built With

Generated admin panels include:

- **React 19** - Modern React features
- **Next.js 15** - App Router with file-based routing  
- **TypeScript** - Type-safe development
- **shadcn/ui** - High-quality accessible components
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible primitives
- **Lucide React** - Beautiful icons

## ⚙️ Configuration

### Environment Variables

Set these in your `.env.local` file:

```env
# App branding
NEXT_PUBLIC_APP_NAME="Your App Name"
NEXT_PUBLIC_DASHBOARD_TITLE="Custom Dashboard Title"

# Authentication (optional)
AUTH_SECRET="your-secret-key"
```

### Customization

All generated files are fully customizable:

1. **App Config**: Modify `lib/app-config.ts` for branding
2. **Components**: Customize `components/ui/` and layout components  
3. **Navigation**: Update sidebar navigation in `components/app-sidebar.tsx`
4. **Authentication**: Modify `lib/auth.ts` for custom auth logic
5. **Styling**: Update Tailwind config and component styles

## 🔧 Development

After generating your admin panel:

```bash
# Start development server
npm run dev

# Visit your admin panel
open http://localhost:3000/admin
```

### Authentication

Default login credentials (customize in `lib/auth.ts`):
- Username: `admin`  
- Password: `password`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/yourusername/shadpanel/blob/main/CONTRIBUTING.md).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [Next.js](https://nextjs.org/) for the fantastic React framework
- [Radix UI](https://radix-ui.com/) for accessible primitives  
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

---

<p align="center">Made with ❤️ for building simple admin panels</p>