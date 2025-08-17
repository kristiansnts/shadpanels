import { logger } from '../../utils/logger';
import { detectProject } from '../../utils/project-detector';
import { generateAdminPanel } from '../generators/admin-panel';
import { setupPathAliases } from '../../utils/alias-setup';
import { confirm } from '../../utils/prompts';
import { execSync } from 'child_process';

export interface InitOptions {
  force?: boolean;
  skipDeps?: boolean;
  appName?: string;
  dryRun?: boolean;
  verbose?: boolean;
}

export async function initCommand(options: InitOptions) {
  try {
    if (options.verbose) {
      logger.setVerbose(true);
      logger.debug('Verbose mode enabled');
    }

    if (options.dryRun) {
      logger.info('Dry run mode - no files will be written');
    }

    logger.info('Initializing ShadPanel...');
    
    // Detect and validate project
    const projectInfo = await detectProject(process.cwd());
    if (!projectInfo.isNextJs) {
      logger.error('This is not a Next.js project. Please run this command in a Next.js project directory.');
      process.exit(1);
    }

    // Check for TypeScript requirement
    if (!projectInfo.hasTypeScript) {
      logger.error('ShadPanel requires TypeScript.');
      logger.error('TypeScript dependency or tsconfig.json not found.');
      logger.info('');
      logger.info('To add TypeScript to your existing project:');
      logger.info('1. npm install --save-dev typescript @types/react @types/node');
      logger.info('2. npx tsc --init');
      logger.info('3. Rename your files from .js to .tsx/.ts');
      logger.info('');
      logger.info('Or create a new Next.js project with TypeScript:');
      logger.info('npx create-next-app@latest my-app --typescript --tailwind --eslint --app');
      process.exit(1);
    }

    // Check for ESLint requirement
    if (!projectInfo.hasEslint) {
      logger.error('ShadPanel requires ESLint.');
      logger.error('ESLint dependency or configuration not found.');
      logger.info('');
      logger.info('To add ESLint to your existing project:');
      logger.info('1. npm install --save-dev eslint eslint-config-next');
      logger.info('2. Create .eslintrc.json with Next.js config');
      logger.info('');
      logger.info('Or create a new Next.js project with ESLint:');
      logger.info('npx create-next-app@latest my-app --typescript --tailwind --eslint --app');
      process.exit(1);
    }

    // Check for Tailwind CSS requirement
    if (!projectInfo.hasTailwind) {
      logger.error('ShadPanel requires Tailwind CSS.');
      logger.error('Tailwind CSS dependency not found.');
      logger.info('');
      logger.info('To add Tailwind CSS to your existing project:');
      logger.info('1. npm install -D tailwindcss postcss autoprefixer');
      logger.info('2. npx tailwindcss init -p');
      logger.info('3. Configure your tailwind.config.js');
      logger.info('4. Add Tailwind directives to your CSS');
      logger.info('');
      logger.info('Or create a new Next.js project with Tailwind:');
      logger.info('npx create-next-app@latest my-app --typescript --tailwind --eslint --app');
      process.exit(1);
    }

    // Handle different router configurations
    if (projectInfo.routerType === 'pages') {
      // Pure Pages Router project
      if (projectInfo.hasSrcPages) {
        logger.error('This project is using Pages Router in src/pages.');
      } else {
        logger.error('This project is using Pages Router.');
      }
      logger.error('ShadPanel currently only supports App Router.');
      logger.info('Please migrate to App Router first:');
      logger.info('📚 Migration Guide: https://nextjs.org/docs/app/guides/migrating/app-router-migration');
      process.exit(1);
    } else if (projectInfo.routerType === 'mixed') {
      logger.warn('This project has both App Router and Pages Router. ShadPanel works with App Router.');
      logger.info('Continuing with App Router setup...');
    } else if (projectInfo.routerType === 'none') {
      logger.error('No router detected. Please ensure this is a valid Next.js project.');
      process.exit(1);
    } else if (!projectInfo.hasAppRouter) {
      logger.error('This project is using Pages Router. ShadPanel requires App Router.');
      logger.info('Run: npx @next/codemod@latest app-router-migration .');
      process.exit(1);
    }

    // Display specific App Router configuration
    if (projectInfo.appLocation === 'src') {
      logger.success(`Detected Next.js project with App Router in src/app`);
    } else {
      logger.success(`Detected Next.js project with App Router`);
    }

    // Check for src/app structure and offer to migrate to app/
    if (projectInfo.appLocation === 'src') {
      logger.info('Detected App Router in src/app directory.');
      logger.info('For better compatibility and convention, we recommend moving to root app/ directory.');
      
      const shouldMoveApp = await confirm(
        'Would you like to move src/app to app/ directory?',
        false
      );
      
      if (shouldMoveApp) {
        logger.info('🔄 Moving src/app to app/...');
        try {
          execSync('mv src/app app', { stdio: 'inherit', cwd: process.cwd() });
          logger.success('✅ App directory moved successfully!');
          
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
              logger.info('🔧 Path aliases need to be updated after directory move...');
              
              const shouldUpdateAlias = await confirm(
                'Update path aliases from "@/*": ["./src/*"] to "@/*": ["./*"]?',
                true
              );
              
              if (shouldUpdateAlias) {
                await setupPathAliases(process.cwd(), projectInfo.hasSrcFolder, projectInfo.hasSrcApp);
                logger.success('✅ Updated path aliases to use root directory');
                
                // Re-detect to update alias status
                const updatedProjectInfo = await detectProject(process.cwd());
                Object.assign(projectInfo, updatedProjectInfo);
              }
            }
          } else if (!projectInfo.hasPathAlias) {
            logger.info('Path aliases (@/*) are not configured in your project.');
            
            const shouldSetupAlias = await confirm(
              'Our project needs path aliases (@/*) for better imports. Do you mind if we set it up?',
              true
            );
            
            if (shouldSetupAlias) {
              logger.info('🔧 Setting up path aliases (@/*) for better imports...');
              await setupPathAliases(process.cwd(), projectInfo.hasSrcFolder, projectInfo.hasSrcApp);
              logger.success('✅ Path aliases configured successfully');
              
              // Re-detect to update alias status
              const updatedProjectInfo = await detectProject(process.cwd());
              Object.assign(projectInfo, updatedProjectInfo);
            } else {
              logger.warn('⚠️  Continuing without path aliases. You may need to use relative imports.');
            }
          }
          
        } catch (error) {
          logger.error('Failed to move app directory:', error instanceof Error ? error.message : String(error));
          logger.info('Please move manually: mv src/app app');
        }
      } else {
        logger.info('Continuing with src/app structure...');
        
        // Check path aliases for src/app structure
        if (!projectInfo.hasPathAlias) {
          logger.info('Path aliases (@/*) are not configured in your project.');
          
          const shouldSetupAlias = await confirm(
            'Our project needs path aliases (@/*) for better imports. Do you mind if we set it up?',
            true
          );
          
          if (shouldSetupAlias) {
            logger.info('🔧 Setting up path aliases (@/*) for better imports...');
            await setupPathAliases(process.cwd(), projectInfo.hasSrcFolder, projectInfo.hasSrcApp);
            logger.success('✅ Path aliases configured successfully');
            
            // Re-detect to update alias status
            const updatedProjectInfo = await detectProject(process.cwd());
            Object.assign(projectInfo, updatedProjectInfo);
          } else {
            logger.warn('⚠️  Continuing without path aliases. You may need to use relative imports.');
          }
        }
      }
    }

    // Path alias configuration is now handled in the directory migration section above

    // Auto-install shadcn/ui components if not already set up
    if (!projectInfo.hasShadcnUi) {
      logger.info('🚀 Installing shadcn/ui and required components...');
      
      try {
        // Initialize shadcn/ui with specific options for src structure
        logger.info('Initializing shadcn/ui...');
        const srcFlag = projectInfo.hasSrcApp ? '--src-dir' : '';
        execSync(`echo -e "New York\\nNeutral\\ny\\ny\\n" | npx shadcn@latest init ${srcFlag}`, { 
          stdio: 'inherit', 
          cwd: process.cwd(),
          shell: '/bin/bash'
        });
        
        // Install required components
        logger.info('Installing required sidebar component...');
        execSync('npx shadcn@latest add sidebar-08', { stdio: 'inherit', cwd: process.cwd() });
        
        logger.info('Installing required login component...');
        execSync('npx shadcn@latest add login-02', { stdio: 'inherit', cwd: process.cwd() });
        
        logger.info('Installing additional UI components...');
        execSync('npx shadcn@latest add label input sheet skeleton tooltip', { stdio: 'inherit', cwd: process.cwd() });
        
        logger.success('✅ shadcn/ui and components installed successfully!');
        
        // Re-detect project to update hasShadcnUi status
        const updatedProjectInfo = await detectProject(process.cwd());
        Object.assign(projectInfo, updatedProjectInfo);
      } catch (error) {
        logger.warn('Installation failed. Please run the manual commands:');
        logger.info('1. npx shadcn@latest init');
        logger.info('2. npx shadcn@latest add label input sheet skeleton tooltip');
        logger.info('3. npx shadpanel init');
        return;
      }
    }

    // Generate admin panel
    await generateAdminPanel(projectInfo, options);

    logger.success('ShadPanel initialized successfully!');
    logger.info('Run `npm run dev` and visit /admin to see your admin panel');

  } catch (error) {
    logger.error('Failed to initialize ShadPanel:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}