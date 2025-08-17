"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminPanel = generateAdminPanel;
const logger_1 = require("../../utils/logger");
const fs_1 = require("../../utils/fs");
const template_processor_1 = require("../../utils/template-processor");
const path = __importStar(require("path"));
async function generateAdminPanel(projectInfo, options) {
    logger_1.logger.debug('Generating admin panel...');
    // Determine directory structure based on project configuration
    // If using src/app, everything goes in src/ (including app)
    // If using root app/, everything goes in root beside app/
    const usesSrcStructure = projectInfo.hasSrcApp;
    const appDir = usesSrcStructure ? 'src/app' : 'app';
    const componentsDir = usesSrcStructure ? 'src/components' : 'components';
    const libDir = usesSrcStructure ? 'src/lib' : 'lib';
    const hooksDir = usesSrcStructure ? 'src/hooks' : 'hooks';
    const typesDir = usesSrcStructure ? 'src/types' : 'types';
    logger_1.logger.debug(`Using directory structure: app=${appDir}, components=${componentsDir}, lib=${libDir}`);
    // Check if shadcn/ui is already set up
    if (!projectInfo.hasShadcnUi) {
        logger_1.logger.info('🚀 Welcome to shadpanel! To get started, you need to install shadcn/ui first.');
        logger_1.logger.info('');
        logger_1.logger.info('Please run the following commands in order:');
        logger_1.logger.info('');
        logger_1.logger.info('1. Initialize shadcn/ui:');
        logger_1.logger.info('   pnpm dlx shadcn@latest init');
        logger_1.logger.info('');
        logger_1.logger.info('2. Add required sidebar component:');
        logger_1.logger.info('   npx shadcn@latest add sidebar-08');
        logger_1.logger.info('');
        logger_1.logger.info('3. Add required login component:');
        logger_1.logger.info('   npx shadcn@latest add login-02');
        logger_1.logger.info('');
        logger_1.logger.info('4. After installing these components, run shadpanel init again:');
        logger_1.logger.info('   npx shadpanel init');
        logger_1.logger.info('');
        logger_1.logger.warn('⚠️  Please complete the above steps before proceeding.');
        return;
    }
    // Check for Tailwind CSS (should be installed by shadcn init)
    if (!projectInfo.hasTailwind) {
        logger_1.logger.warn('⚠️  Tailwind CSS not detected. This should have been installed by shadcn/ui.');
        logger_1.logger.info('Please run: pnpm dlx shadcn@latest init');
        if (!options.force) {
            return;
        }
    }
    // Note: We always generate/overwrite files to act as a template generator
    if (projectInfo.hasExistingAdmin && !options.force) {
        logger_1.logger.info('⚠️  Existing admin routes detected. Files will be overwritten.');
    }
    const variables = (0, template_processor_1.getDefaultVariables)(options.appName || 'Admin Panel');
    const templatesDir = path.join(__dirname, '../../../src/templates');
    const projectRoot = projectInfo.rootPath;
    // Generate admin layout
    await generateFile((0, fs_1.joinPath)(templatesDir, 'app/admin/layout.tsx'), (0, fs_1.joinPath)(projectRoot, appDir, 'admin/layout.tsx'), variables, options);
    // Generate admin dashboard
    await generateFile((0, fs_1.joinPath)(templatesDir, 'app/admin/page.tsx'), (0, fs_1.joinPath)(projectRoot, appDir, 'admin/page.tsx'), variables, options);
    // Generate API auth routes
    await generateFile((0, fs_1.joinPath)(templatesDir, 'app/api/auth/login/route.ts'), (0, fs_1.joinPath)(projectRoot, appDir, 'api/auth/login/route.ts'), variables, options);
    await generateFile((0, fs_1.joinPath)(templatesDir, 'app/api/auth/logout/route.ts'), (0, fs_1.joinPath)(projectRoot, appDir, 'api/auth/logout/route.ts'), variables, options);
    await generateFile((0, fs_1.joinPath)(templatesDir, 'app/api/auth/status/route.ts'), (0, fs_1.joinPath)(projectRoot, appDir, 'api/auth/status/route.ts'), variables, options);
    // Generate login layout
    await generateFile((0, fs_1.joinPath)(templatesDir, 'app/login/layout.tsx'), (0, fs_1.joinPath)(projectRoot, appDir, 'login/layout.tsx'), variables, options);
    // Generate login page
    await generateFile((0, fs_1.joinPath)(templatesDir, 'app/login/page.tsx'), (0, fs_1.joinPath)(projectRoot, appDir, 'login/page.tsx'), variables, options);
    // Generate sidebar components
    await generateFile((0, fs_1.joinPath)(templatesDir, 'components/app-sidebar.tsx'), (0, fs_1.joinPath)(projectRoot, componentsDir, 'app-sidebar.tsx'), variables, options);
    await generateFile((0, fs_1.joinPath)(templatesDir, 'components/nav-main.tsx'), (0, fs_1.joinPath)(projectRoot, componentsDir, 'nav-main.tsx'), variables, options);
    await generateFile((0, fs_1.joinPath)(templatesDir, 'components/nav-projects.tsx'), (0, fs_1.joinPath)(projectRoot, componentsDir, 'nav-projects.tsx'), variables, options);
    await generateFile((0, fs_1.joinPath)(templatesDir, 'components/nav-user.tsx'), (0, fs_1.joinPath)(projectRoot, componentsDir, 'nav-user.tsx'), variables, options);
    await generateFile((0, fs_1.joinPath)(templatesDir, 'components/team-switcher.tsx'), (0, fs_1.joinPath)(projectRoot, componentsDir, 'team-switcher.tsx'), variables, options);
    // Note: UI components are now provided by shadcn/ui installation
    // No need to generate UI components manually
    // Note: lib/utils.ts is provided by shadcn/ui installation
    await generateFile((0, fs_1.joinPath)(templatesDir, 'lib/app-config.ts'), (0, fs_1.joinPath)(projectRoot, libDir, 'app-config.ts'), variables, options);
    await generateFile((0, fs_1.joinPath)(templatesDir, 'lib/icons.ts'), (0, fs_1.joinPath)(projectRoot, libDir, 'icons.ts'), variables, options);
    await generateFile((0, fs_1.joinPath)(templatesDir, 'lib/auth.ts'), (0, fs_1.joinPath)(projectRoot, libDir, 'auth.ts'), variables, options);
    // Generate types
    await generateFile((0, fs_1.joinPath)(templatesDir, 'types/navigation.ts'), (0, fs_1.joinPath)(projectRoot, typesDir, 'navigation.ts'), variables, options);
    // Generate additional components
    await generateFile((0, fs_1.joinPath)(templatesDir, 'components/login-form.tsx'), (0, fs_1.joinPath)(projectRoot, componentsDir, 'login-form.tsx'), variables, options);
    // Generate hooks
    await generateFile((0, fs_1.joinPath)(templatesDir, 'hooks/use-mobile.tsx'), (0, fs_1.joinPath)(projectRoot, hooksDir, 'use-mobile.tsx'), variables, options);
    await generateFile((0, fs_1.joinPath)(templatesDir, 'hooks/use-auth.ts'), (0, fs_1.joinPath)(projectRoot, hooksDir, 'use-auth.ts'), variables, options);
    // Generate middleware (in src/ if using src structure, otherwise at root)
    const middlewarePath = usesSrcStructure ? 'src/middleware.ts' : 'middleware.ts';
    await generateFile((0, fs_1.joinPath)(templatesDir, 'middleware.ts'), (0, fs_1.joinPath)(projectRoot, middlewarePath), variables, options);
    // Generate next.config.ts (always at root level)
    await generateFile((0, fs_1.joinPath)(templatesDir, 'next.config.ts'), (0, fs_1.joinPath)(projectRoot, 'next.config.ts'), variables, options);
    // Generate public assets
    await (0, fs_1.copyFile)((0, fs_1.joinPath)(templatesDir, 'public/placeholder.svg'), (0, fs_1.joinPath)(projectRoot, 'public/placeholder.svg'), options.force ?? true);
    logger_1.logger.success('Admin panel files generated successfully');
    logger_1.logger.info('');
    logger_1.logger.info('✅ Your admin panel is ready to use!');
    logger_1.logger.info('✅ Using shadcn/ui components with custom templates');
    logger_1.logger.info('');
    logger_1.logger.info('Available routes:');
    logger_1.logger.info('• /admin - Dashboard page');
    logger_1.logger.info('• /login - Login page');
    logger_1.logger.info('');
    logger_1.logger.info('Start your development server to see the admin panel in action!');
}
async function generateFile(templatePath, destinationPath, variables, options) {
    try {
        if (options.dryRun) {
            logger_1.logger.info(`Would generate: ${destinationPath}`);
            return;
        }
        const templateContent = await (0, fs_1.readFile)(templatePath);
        const processedContent = (0, template_processor_1.processTemplate)(templateContent, variables);
        // Always overwrite files in template generation mode (default behavior)
        const forceOverwrite = options.force ?? true;
        const written = await (0, fs_1.writeFile)(destinationPath, processedContent, forceOverwrite);
        if (written) {
            logger_1.logger.success(`Generated: ${destinationPath}`);
        }
        else {
            logger_1.logger.warn(`Skipped existing file: ${destinationPath}`);
        }
    }
    catch (error) {
        logger_1.logger.error(`Failed to generate ${destinationPath}:`, error instanceof Error ? error.message : String(error));
    }
}
