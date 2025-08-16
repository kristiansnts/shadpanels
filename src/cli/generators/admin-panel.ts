import { ProjectInfo } from '../../utils/project-detector';
import { InitOptions } from '../commands/init';
import { logger } from '../../utils/logger';
import { writeFile, readFile, joinPath } from '../../utils/fs';
import { processTemplate, getDefaultVariables, TemplateVariables } from '../../utils/template-processor';
import * as path from 'path';

export async function generateAdminPanel(projectInfo: ProjectInfo, options: InitOptions) {
  logger.debug('Generating admin panel...');

  if (projectInfo.hasExistingAdmin && !options.force) {
    logger.warn('Existing admin routes detected. Use --force to overwrite.');
    return;
  }

  // Check for shadcn/ui setup
  if (!projectInfo.hasShadcnUi) {
    logger.warn('⚠️  shadcn/ui not detected. The generated components will require shadcn/ui.');
    logger.info('To set up shadcn/ui, run:');
    logger.info('  npx shadcn@latest init');
    logger.info('Then install the required components:');
    logger.info('  npx shadcn@latest add card button input label sidebar breadcrumb separator');
    logger.info('');
    
    if (!options.force) {
      logger.warn('Use --force to generate components anyway.');
      return;
    }
  }

  // Check for Tailwind CSS
  if (!projectInfo.hasTailwind) {
    logger.warn('⚠️  Tailwind CSS not detected. shadcn/ui requires Tailwind CSS.');
    logger.info('Install Tailwind CSS first: https://tailwindcss.com/docs/guides/nextjs');
    
    if (!options.force) {
      return;
    }
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

  // Generate app-sidebar component
  await generateFile(
    joinPath(templatesDir, 'components/app-sidebar.tsx'),
    joinPath(projectRoot, 'components/app-sidebar.tsx'),
    variables,
    options
  );

  logger.success('Admin panel files generated successfully');
  
  if (projectInfo.hasShadcnUi) {
    logger.info('✅ shadcn/ui detected - components should work out of the box');
  } else {
    logger.info('');
    logger.info('Next steps:');
    logger.info('1. Set up shadcn/ui: npx shadcn@latest init');
    logger.info('2. Install components: npx shadcn@latest add card button input label sidebar breadcrumb separator');
    logger.info('3. Add the missing nav components (nav-main, nav-projects, nav-user, team-switcher)');
  }
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
    
    const written = await writeFile(destinationPath, processedContent, options.force);
    
    if (written) {
      logger.success(`Generated: ${destinationPath}`);
    } else if (!options.force) {
      logger.warn(`Skipped existing file: ${destinationPath}`);
    }
  } catch (error) {
    logger.error(`Failed to generate ${destinationPath}:`, error instanceof Error ? error.message : String(error));
  }
}