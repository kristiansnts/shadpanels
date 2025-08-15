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

  const variables = getDefaultVariables(options.appName || 'Admin Panel');
  const templatesDir = path.join(__dirname, '../../templates');
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

  logger.success('Admin panel files generated successfully');
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