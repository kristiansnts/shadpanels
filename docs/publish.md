# Publishing ShadPanel to npm

This guide covers the complete process of publishing ShadPanel as an npm package.

## Prerequisites

### 1. npm Account Setup
```bash
# Create account at https://www.npmjs.com/signup
# Then login locally
npm login
```

### 2. Verify Package Configuration
Check that `package.json` is properly configured:

```json
{
  "name": "shadpanel",
  "version": "0.1.0",
  "private": false,                    // Must be false to publish
  "bin": {
    "shadpanel": "./dist/cli/index.js" // CLI entry point
  },
  "files": [                          // What gets included in package
    "dist/",
    "src/templates/",
    "README.md",
    "LICENSE"
  ],
  "keywords": [                       // Help users find your package
    "nextjs",
    "admin",
    "panel",
    "cli",
    "shadcn",
    "react"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/shadpanel.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/shadpanel/issues"
  },
  "homepage": "https://github.com/yourusername/shadpanel#readme"
}
```

## Pre-Publication Steps

### 1. Build the CLI
```bash
# Clean and rebuild
rm -rf dist/
npm run build:cli

# Verify build output
ls -la dist/cli/
```

### 2. Test Locally
```bash
# Test in current project
npm run cli -- init --dry-run --verbose

# Test installation simulation
npm pack
# This creates shadpanel-0.1.0.tgz - you can test install with:
# npm install ./shadpanel-0.1.0.tgz
```

### 3. Update Version (if needed)
```bash
# Patch version (0.1.0 -> 0.1.1)
npm version patch

# Minor version (0.1.0 -> 0.2.0) 
npm version minor

# Major version (0.1.0 -> 1.0.0)
npm version major
```

### 4. Create .npmignore
```bash
# .npmignore - exclude development files from published package
node_modules/
.git/
.gitignore
.eslintrc*
*.log
coverage/
.nyc_output/
.env*
tsconfig*.json
src/           # Don't include TypeScript source (only dist/)
app/           # Don't include Next.js app
components/    # Don't include Next.js components
hooks/
lib/
types/
middleware.ts
next.config.ts
tailwind.config.*
postcss.config.*
.next/
```

## Publishing Process

### 1. Dry Run Publication
```bash
# See what would be published without actually publishing
npm publish --dry-run
```

### 2. Check Package Name Availability
```bash
# Check if name is available
npm info shadpanel

# If taken, you'll need to:
# - Use scoped package: @yourusername/shadpanel
# - Choose different name: shadpanel-cli, next-shadpanel, etc.
```

### 3. Publish to npm
```bash
# Publish public package
npm publish

# If using scoped package name (@yourusername/shadpanel):
npm publish --access public
```

## Post-Publication

### 1. Verify Publication
```bash
# Check your package on npm
npm info shadpanel

# Test installation in a fresh directory
mkdir test-install && cd test-install
npx create-next-app@latest test-app --typescript --tailwind --eslint --app
cd test-app
npx shadpanel init --dry-run
```

### 2. Update Documentation
- Update README.md with installation instructions
- Add npm badge: `![npm](https://img.shields.io/npm/v/shadpanel)`
- Document breaking changes if version > 1.0.0

### 3. Tag Release on GitHub
```bash
git tag v0.1.0
git push origin v0.1.0
```

## Package Updates

### For Bug Fixes (Patch)
```bash
# Fix bugs, then:
npm version patch
npm run build:cli
npm publish
```

### For New Features (Minor)
```bash
# Add features, then:
npm version minor
npm run build:cli  
npm publish
```

### For Breaking Changes (Major)
```bash
# Breaking changes, then:
npm version major
npm run build:cli
npm publish
```

## Important Notes

### Package Structure in npm
When users install your package, they get:
```
node_modules/
└── shadpanel/
    ├── dist/cli/index.js    # Your compiled CLI
    ├── src/templates/       # Template files
    ├── package.json         # Points to dist/cli/index.js
    └── README.md
```

### CLI Usage After Publication
Users can then use:
```bash
# One-time usage
npx shadpanel init

# Global installation
npm install -g shadpanel
shadpanel init

# Project dependency
npm install shadpanel
npx shadpanel init
```

### Version Management Best Practices
- Use semantic versioning (semver): MAJOR.MINOR.PATCH
- PATCH: Bug fixes (0.1.0 → 0.1.1)
- MINOR: New features, backward compatible (0.1.0 → 0.2.0)  
- MAJOR: Breaking changes (0.1.0 → 1.0.0)

### Common Issues
1. **"private": true** - Must be false to publish
2. **Missing "bin" field** - Required for CLI packages
3. **Wrong file paths** - Ensure dist/cli/index.js exists and is executable
4. **Package name taken** - Use scoped name or different name
5. **Missing build** - Always run `npm run build:cli` before publishing

## Automation (Future)
Consider setting up GitHub Actions for automated publishing:
```yaml
# .github/workflows/publish.yml
name: Publish to npm
on:
  release:
    types: [created]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build:cli
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

This ensures consistent builds and automated publishing on GitHub releases.