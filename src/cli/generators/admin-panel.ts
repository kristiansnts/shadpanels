import { ProjectInfo } from '../../utils/project-detector';
import { InitOptions } from '../commands/init';
import { logger } from '../../utils/logger';
import { writeFile, readFile, joinPath } from '../../utils/fs';
import { processTemplate, getDefaultVariables, TemplateVariables } from '../../utils/template-processor';
import * as path from 'path';

export async function generateAdminPanel(projectInfo: ProjectInfo, options: InitOptions) {
  logger.debug('Generating admin panel...');

  // Check if shadcn/ui is already set up
  if (!projectInfo.hasShadcnUi) {
    logger.info('🚀 Welcome to shadpanel! To get started, you need to install shadcn/ui first.');
    logger.info('');
    logger.info('Please run the following commands in order:');
    logger.info('');
    logger.info('1. Initialize shadcn/ui:');
    logger.info('   pnpm dlx shadcn@latest init');
    logger.info('');
    logger.info('2. Add required sidebar component:');
    logger.info('   npx shadcn@latest add sidebar-08');
    logger.info('');
    logger.info('3. Add required login component:');
    logger.info('   npx shadcn@latest add login-02');
    logger.info('');
    logger.info('4. After installing these components, run shadpanel init again:');
    logger.info('   npx shadpanel init');
    logger.info('');
    logger.warn('⚠️  Please complete the above steps before proceeding.');
    return;
  }

  // Check for Tailwind CSS (should be installed by shadcn init)
  if (!projectInfo.hasTailwind) {
    logger.warn('⚠️  Tailwind CSS not detected. This should have been installed by shadcn/ui.');
    logger.info('Please run: pnpm dlx shadcn@latest init');
    
    if (!options.force) {
      return;
    }
  }

  // Note: We always generate/overwrite files to act as a template generator
  if (projectInfo.hasExistingAdmin && !options.force) {
    logger.info('⚠️  Existing admin routes detected. Files will be overwritten.');
  }

  const variables = getDefaultVariables(options.appName || 'Admin Panel');
  const templatesDir = path.join(__dirname, '../../../src/templates');
  const projectRoot = projectInfo.rootPath;

  // Generate admin layout
  await generateFile(
    joinPath(templatesDir, 'app/admin/layout.tsx'),
    joinPath(projectRoot, 'app/admin/layout.tsx'),
    variables,
    options
  );

  // Generate admin dashboard
  await generateFile(
    joinPath(templatesDir, 'app/admin/page.tsx'),
    joinPath(projectRoot, 'app/admin/page.tsx'),
    variables,
    options
  );

  // Generate login layout
  await generateFile(
    joinPath(templatesDir, 'app/login/layout.tsx'),
    joinPath(projectRoot, 'app/login/layout.tsx'),
    variables,
    options
  );

  // Generate login page
  await generateFile(
    joinPath(templatesDir, 'app/login/page.tsx'),
    joinPath(projectRoot, 'app/login/page.tsx'),
    variables,
    options
  );

  // Generate sidebar components
  await generateFile(
    joinPath(templatesDir, 'components/app-sidebar.tsx'),
    joinPath(projectRoot, 'components/app-sidebar.tsx'),
    variables,
    options
  );

  await generateFile(
    joinPath(templatesDir, 'components/nav-main.tsx'),
    joinPath(projectRoot, 'components/nav-main.tsx'),
    variables,
    options
  );

  await generateFile(
    joinPath(templatesDir, 'components/nav-projects.tsx'),
    joinPath(projectRoot, 'components/nav-projects.tsx'),
    variables,
    options
  );

  await generateFile(
    joinPath(templatesDir, 'components/nav-user.tsx'),
    joinPath(projectRoot, 'components/nav-user.tsx'),
    variables,
    options
  );

  await generateFile(
    joinPath(templatesDir, 'components/team-switcher.tsx'),
    joinPath(projectRoot, 'components/team-switcher.tsx'),
    variables,
    options
  );

  // Note: UI components are now provided by shadcn/ui installation
  // No need to generate UI components manually

  // Note: lib/utils.ts is provided by shadcn/ui installation

  await generateFile(
    joinPath(templatesDir, 'lib/app-config.ts'),
    joinPath(projectRoot, 'lib/app-config.ts'),
    variables,
    options
  );

  await generateFile(
    joinPath(templatesDir, 'lib/icons.ts'),
    joinPath(projectRoot, 'lib/icons.ts'),
    variables,
    options
  );

  // Generate types
  await generateFile(
    joinPath(templatesDir, 'types/navigation.ts'),
    joinPath(projectRoot, 'types/navigation.ts'),
    variables,
    options
  );

  // Generate additional components
  await generateFile(
    joinPath(templatesDir, 'components/login-form.tsx'),
    joinPath(projectRoot, 'components/login-form.tsx'),
    variables,
    options
  );

  // Generate hooks
  await generateFile(
    joinPath(templatesDir, 'hooks/use-mobile.tsx'),
    joinPath(projectRoot, 'hooks/use-mobile.tsx'),
    variables,
    options
  );

  logger.success('Admin panel files generated successfully');
  logger.info('');
  logger.info('✅ Your admin panel is ready to use!');
  logger.info('✅ Using shadcn/ui components with custom templates');
  logger.info('');
  logger.info('Available routes:');
  logger.info('• /admin - Dashboard page');
  logger.info('• /login - Login page');
  logger.info('');
  logger.info('Start your development server to see the admin panel in action!')
}

async function generateFile(
  templatePath: string,
  destinationPath: string,
  variables: TemplateVariables,
  options: InitOptions
) {
  try {
    if (options.dryRun) {
      logger.info(`Would generate: ${destinationPath}`);
      return;
    }

    const templateContent = await readFile(templatePath);
    const processedContent = processTemplate(templateContent, variables);
    
    // Always overwrite files in template generation mode (default behavior)
    const forceOverwrite = options.force ?? true;
    const written = await writeFile(destinationPath, processedContent, forceOverwrite);
    
    if (written) {
      logger.success(`Generated: ${destinationPath}`);
    } else {
      logger.warn(`Skipped existing file: ${destinationPath}`);
    }
  } catch (error) {
    logger.error(`Failed to generate ${destinationPath}:`, error instanceof Error ? error.message : String(error));
  }
}