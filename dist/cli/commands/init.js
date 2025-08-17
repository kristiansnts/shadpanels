"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const logger_1 = require("../../utils/logger");
const project_detector_1 = require("../../utils/project-detector");
const admin_panel_1 = require("../generators/admin-panel");
const alias_setup_1 = require("../../utils/alias-setup");
const prompts_1 = require("../../utils/prompts");
const child_process_1 = require("child_process");
async function initCommand(options) {
    try {
        if (options.verbose) {
            logger_1.logger.setVerbose(true);
            logger_1.logger.debug('Verbose mode enabled');
        }
        if (options.dryRun) {
            logger_1.logger.info('Dry run mode - no files will be written');
        }
        logger_1.logger.info('Initializing ShadPanel...');
        // Detect and validate project
        const projectInfo = await (0, project_detector_1.detectProject)(process.cwd());
        if (!projectInfo.isNextJs) {
            logger_1.logger.error('This is not a Next.js project. Please run this command in a Next.js project directory.');
            process.exit(1);
        }
        // Check for TypeScript requirement
        if (!projectInfo.hasTypeScript) {
            logger_1.logger.error('ShadPanel requires TypeScript.');
            logger_1.logger.error('TypeScript dependency or tsconfig.json not found.');
            logger_1.logger.info('');
            logger_1.logger.info('To add TypeScript to your existing project:');
            logger_1.logger.info('1. npm install --save-dev typescript @types/react @types/node');
            logger_1.logger.info('2. npx tsc --init');
            logger_1.logger.info('3. Rename your files from .js to .tsx/.ts');
            logger_1.logger.info('');
            logger_1.logger.info('Or create a new Next.js project with TypeScript:');
            logger_1.logger.info('npx create-next-app@latest my-app --typescript --tailwind --eslint --app');
            process.exit(1);
        }
        // Check for ESLint requirement
        if (!projectInfo.hasEslint) {
            logger_1.logger.error('ShadPanel requires ESLint.');
            logger_1.logger.error('ESLint dependency or configuration not found.');
            logger_1.logger.info('');
            logger_1.logger.info('To add ESLint to your existing project:');
            logger_1.logger.info('1. npm install --save-dev eslint eslint-config-next');
            logger_1.logger.info('2. Create .eslintrc.json with Next.js config');
            logger_1.logger.info('');
            logger_1.logger.info('Or create a new Next.js project with ESLint:');
            logger_1.logger.info('npx create-next-app@latest my-app --typescript --tailwind --eslint --app');
            process.exit(1);
        }
        // Check for Tailwind CSS requirement
        if (!projectInfo.hasTailwind) {
            logger_1.logger.error('ShadPanel requires Tailwind CSS.');
            logger_1.logger.error('Tailwind CSS dependency not found.');
            logger_1.logger.info('');
            logger_1.logger.info('To add Tailwind CSS to your existing project:');
            logger_1.logger.info('1. npm install -D tailwindcss postcss autoprefixer');
            logger_1.logger.info('2. npx tailwindcss init -p');
            logger_1.logger.info('3. Configure your tailwind.config.js');
            logger_1.logger.info('4. Add Tailwind directives to your CSS');
            logger_1.logger.info('');
            logger_1.logger.info('Or create a new Next.js project with Tailwind:');
            logger_1.logger.info('npx create-next-app@latest my-app --typescript --tailwind --eslint --app');
            process.exit(1);
        }
        // Handle different router configurations
        if (projectInfo.routerType === 'pages') {
            // Pure Pages Router project
            if (projectInfo.hasSrcPages) {
                logger_1.logger.error('This project is using Pages Router in src/pages.');
            }
            else {
                logger_1.logger.error('This project is using Pages Router.');
            }
            logger_1.logger.error('ShadPanel currently only supports App Router.');
            logger_1.logger.info('Please migrate to App Router first:');
            logger_1.logger.info('📚 Migration Guide: https://nextjs.org/docs/app/guides/migrating/app-router-migration');
            process.exit(1);
        }
        else if (projectInfo.routerType === 'mixed') {
            logger_1.logger.warn('This project has both App Router and Pages Router. ShadPanel works with App Router.');
            logger_1.logger.info('Continuing with App Router setup...');
        }
        else if (projectInfo.routerType === 'none') {
            logger_1.logger.error('No router detected. Please ensure this is a valid Next.js project.');
            process.exit(1);
        }
        else if (!projectInfo.hasAppRouter) {
            logger_1.logger.error('This project is using Pages Router. ShadPanel requires App Router.');
            logger_1.logger.info('Run: npx @next/codemod@latest app-router-migration .');
            process.exit(1);
        }
        // Display specific App Router configuration
        if (projectInfo.appLocation === 'src') {
            logger_1.logger.success(`Detected Next.js project with App Router in src/app`);
        }
        else {
            logger_1.logger.success(`Detected Next.js project with App Router`);
        }
        // Check for src/app structure and offer to migrate to app/
        if (projectInfo.appLocation === 'src') {
            logger_1.logger.info('Detected App Router in src/app directory.');
            logger_1.logger.info('For better compatibility and convention, we recommend moving to root app/ directory.');
            const shouldMoveApp = await (0, prompts_1.confirm)('Would you like to move src/app to app/ directory?', false);
            if (shouldMoveApp) {
                logger_1.logger.info('🔄 Moving src/app to app/...');
                try {
                    (0, child_process_1.execSync)('mv src/app app', { stdio: 'inherit', cwd: process.cwd() });
                    logger_1.logger.success('✅ App directory moved successfully!');
                    // Update project info immediately after move
                    projectInfo.hasSrcApp = false;
                    projectInfo.hasRootApp = true;
                    projectInfo.appLocation = 'root';
                    projectInfo.routerType = 'app';
                    // Check if src folder still exists (for other content)  
                    const { directoryExists, joinPath } = require('../../utils/fs');
                    projectInfo.hasSrcFolder = await directoryExists(joinPath(process.cwd(), 'src'));
                    // Handle path aliases after moving from src/app to app/
                    if (projectInfo.hasPathAlias && projectInfo.tsConfigJson?.compilerOptions?.paths) {
                        const paths = projectInfo.tsConfigJson.compilerOptions.paths;
                        if (paths['@/*'] && paths['@/*'][0] === './src/*') {
                            logger_1.logger.info('🔧 Path aliases need to be updated after directory move...');
                            const shouldUpdateAlias = await (0, prompts_1.confirm)('Update path aliases from "@/*": ["./src/*"] to "@/*": ["./*"]?', true);
                            if (shouldUpdateAlias) {
                                await (0, alias_setup_1.setupPathAliases)(process.cwd(), projectInfo.hasSrcFolder, projectInfo.hasSrcApp);
                                logger_1.logger.success('✅ Updated path aliases to use root directory');
                                // Re-detect to update alias status
                                const updatedProjectInfo = await (0, project_detector_1.detectProject)(process.cwd());
                                Object.assign(projectInfo, updatedProjectInfo);
                            }
                        }
                    }
                    else if (!projectInfo.hasPathAlias) {
                        logger_1.logger.info('Path aliases (@/*) are not configured in your project.');
                        const shouldSetupAlias = await (0, prompts_1.confirm)('Our project needs path aliases (@/*) for better imports. Do you mind if we set it up?', true);
                        if (shouldSetupAlias) {
                            logger_1.logger.info('🔧 Setting up path aliases (@/*) for better imports...');
                            await (0, alias_setup_1.setupPathAliases)(process.cwd(), projectInfo.hasSrcFolder, projectInfo.hasSrcApp);
                            logger_1.logger.success('✅ Path aliases configured successfully');
                            // Re-detect to update alias status
                            const updatedProjectInfo = await (0, project_detector_1.detectProject)(process.cwd());
                            Object.assign(projectInfo, updatedProjectInfo);
                        }
                        else {
                            logger_1.logger.warn('⚠️  Continuing without path aliases. You may need to use relative imports.');
                        }
                    }
                }
                catch (error) {
                    logger_1.logger.error('Failed to move app directory:', error instanceof Error ? error.message : String(error));
                    logger_1.logger.info('Please move manually: mv src/app app');
                }
            }
            else {
                logger_1.logger.info('Continuing with src/app structure...');
                // Check path aliases for src/app structure
                if (!projectInfo.hasPathAlias) {
                    logger_1.logger.info('Path aliases (@/*) are not configured in your project.');
                    const shouldSetupAlias = await (0, prompts_1.confirm)('Our project needs path aliases (@/*) for better imports. Do you mind if we set it up?', true);
                    if (shouldSetupAlias) {
                        logger_1.logger.info('🔧 Setting up path aliases (@/*) for better imports...');
                        await (0, alias_setup_1.setupPathAliases)(process.cwd(), projectInfo.hasSrcFolder, projectInfo.hasSrcApp);
                        logger_1.logger.success('✅ Path aliases configured successfully');
                        // Re-detect to update alias status
                        const updatedProjectInfo = await (0, project_detector_1.detectProject)(process.cwd());
                        Object.assign(projectInfo, updatedProjectInfo);
                    }
                    else {
                        logger_1.logger.warn('⚠️  Continuing without path aliases. You may need to use relative imports.');
                    }
                }
            }
        }
        // Path alias configuration is now handled in the directory migration section above
        // Auto-install shadcn/ui components if not already set up
        if (!projectInfo.hasShadcnUi) {
            logger_1.logger.info('🚀 Installing shadcn/ui and required components...');
            try {
                // Initialize shadcn/ui with specific options for src structure
                logger_1.logger.info('Initializing shadcn/ui...');
                const srcFlag = projectInfo.hasSrcApp ? '--src-dir' : '';
                (0, child_process_1.execSync)(`echo -e "New York\\nNeutral\\ny\\ny\\n" | npx shadcn@latest init ${srcFlag}`, {
                    stdio: 'inherit',
                    cwd: process.cwd(),
                    shell: '/bin/bash'
                });
                // Install required components
                logger_1.logger.info('Installing required sidebar component...');
                (0, child_process_1.execSync)('npx shadcn@latest add sidebar-08', { stdio: 'inherit', cwd: process.cwd() });
                logger_1.logger.info('Installing required login component...');
                (0, child_process_1.execSync)('npx shadcn@latest add login-02', { stdio: 'inherit', cwd: process.cwd() });
                logger_1.logger.info('Installing additional UI components...');
                (0, child_process_1.execSync)('npx shadcn@latest add label input sheet skeleton tooltip', { stdio: 'inherit', cwd: process.cwd() });
                logger_1.logger.success('✅ shadcn/ui and components installed successfully!');
                // Re-detect project to update hasShadcnUi status
                const updatedProjectInfo = await (0, project_detector_1.detectProject)(process.cwd());
                Object.assign(projectInfo, updatedProjectInfo);
            }
            catch (error) {
                logger_1.logger.warn('Installation failed. Please run the manual commands:');
                logger_1.logger.info('1. npx shadcn@latest init');
                logger_1.logger.info('2. npx shadcn@latest add label input sheet skeleton tooltip');
                logger_1.logger.info('3. npx shadpanel init');
                return;
            }
        }
        // Generate admin panel
        await (0, admin_panel_1.generateAdminPanel)(projectInfo, options);
        logger_1.logger.success('ShadPanel initialized successfully!');
        logger_1.logger.info('Run `npm run dev` and visit /admin to see your admin panel');
    }
    catch (error) {
        logger_1.logger.error('Failed to initialize ShadPanel:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}
