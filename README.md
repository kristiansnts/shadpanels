# ShadPanel

A modern Next.js admin panel built with shadcn/ui, inspired by FilamentPHP. ShadPanel delivers a clean, accessible, and highly customizable foundation for admin interfaces—with first-class TypeScript support.

![ShadPanel](./shadpanel.png)

## ✨ Features

- **🎨 Modern UI**: Built with shadcn/ui components for a consistent, beautiful interface
- **📱 Responsive**: Mobile-first design that works on all devices
- **🧭 Smart Navigation**: Context-aware sidebar with collapsible support
- **🔧 Modular Components**: Clean, reusable UI components built with Radix primitives
- **🔒 Type Safe**: Full TypeScript support with strict type checking
- **⚡ Fast Routing**: Next.js App Router with file-based routing
- **🎯 Accessibility**: WCAG compliant components with proper ARIA support
- **🛠️ Developer Experience**: Hot reload, ESLint, and modern build tools
- **🔐 Authentication**: Built-in authentication system with login/logout functionality

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/kristiansnts/shadpanel.git
cd shadpanel

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000` to see your admin panel in action.

## 🏗️ Project Structure

```
/
├── app/                     # Next.js App Router
│   ├── admin/              # Admin panel pages
│   ├── api/                # API routes
│   │   └── auth/           # Authentication endpoints
│   ├── login/              # Login page
│   └── globals.css         # Global styles
├── components/             # Reusable components
│   ├── ui/                 # shadcn/ui components
│   ├── app-sidebar.tsx     # Main navigation sidebar
│   ├── app-header.tsx      # Header component
│   ├── login-form.tsx      # Login form component
│   └── nav-*.tsx           # Navigation components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and configurations
├── types/                  # TypeScript type definitions
└── middleware.ts           # Next.js middleware
```

## 🎨 Built With

- **React 19** - Latest React with modern features
- **Next.js 15** - Full-stack React framework with App Router
- **TypeScript** - Type-safe development
- **shadcn/ui** - High-quality, accessible UI components
- **Tailwind CSS 4** - Latest utility-first CSS framework
- **Radix UI** - Low-level accessible UI primitives
- **Lucide React** - Beautiful, customizable icons
- **Class Variance Authority** - Type-safe component variants

## 📊 Features Overview

### Authentication
- Secure login/logout system
- Session management with middleware
- Protected routes and API endpoints
- User authentication hooks

### Navigation
- Collapsible sidebar navigation
- User profile dropdown
- Active state management
- Mobile-friendly responsive design

### Admin Panel
- Clean admin interface
- Customizable dashboard
- Component-based architecture
- Type-safe navigation configuration

## 🛠️ Development

### Available Scripts

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

### Customization

ShadPanel is designed to be highly customizable:

1. **App Config**: Modify app name and settings in `lib/app-config.ts`
2. **Components**: All shadcn/ui components can be customized in `components/ui/`
3. **Layout**: Modify sidebar and header components for your brand
4. **Routing**: Add new routes in the `app/` directory (Next.js App Router)
5. **Styling**: Update Tailwind CSS configuration and global styles

## 📱 FilamentPHP Inspiration

ShadPanel takes inspiration from FilamentPHP's excellent admin panel design:

- **Clean, minimal interface** with focus on content
- **Consistent component patterns** across the application
- **Logical information hierarchy** for better user experience
- **Responsive design** that works on all devices
- **Accessible by default** with proper ARIA support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [FilamentPHP](https://filamentphp.com/) for design inspiration
- [TanStack](https://tanstack.com/) for excellent developer tools
- [Radix UI](https://radix-ui.com/) for accessible primitives

## 📞 Support

- 📧 Email: epafroditus.kristian@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/kristiansnts/shadpanel/issues)

---

<p align="center">Made with ❤️ by the ShadPanel team</p>
