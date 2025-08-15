import { logger } from '../../utils/logger';
import { detectProject } from '../../utils/project-detector';
import { generateAdminPanel } from '../generators/admin-panel';

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

    if (!projectInfo.hasAppRouter) {
      logger.error('This project is using Pages Router. ShadPanel requires App Router.');
      logger.info('Run: npx @next/codemod@latest app-router-migration .');
      process.exit(1);
    }

    logger.success(`Detected Next.js project with App Router`);

    // Generate admin panel
    await generateAdminPanel(projectInfo, options);

    logger.success('ShadPanel initialized successfully!');
    logger.info('Run `npm run dev` and visit /admin to see your admin panel');

  } catch (error) {
    logger.error('Failed to initialize ShadPanel:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}