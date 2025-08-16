import { fileExists, directoryExists, readFile } from './fs';
import { joinPath } from './fs';
import { logger } from './logger';

export interface ProjectInfo {
  isNextJs: boolean;
  hasAppRouter: boolean;
  hasPages: boolean;
  hasExistingAdmin: boolean;
  hasShadcnUi: boolean;
  hasTailwind: boolean;
  rootPath: string;
  packageJson?: any;
  componentsJson?: any;
}

export async function detectProject(rootPath: string): Promise<ProjectInfo> {
  logger.debug(`Detecting project at: ${rootPath}`);

  const projectInfo: ProjectInfo = {
    isNextJs: false,
    hasAppRouter: false,
    hasPages: false,
    hasExistingAdmin: false,
    hasShadcnUi: false,
    hasTailwind: false,
    rootPath,
  };

  // Check for Next.js project
  const nextConfigJs = await fileExists(joinPath(rootPath, 'next.config.js'));
  const nextConfigTs = await fileExists(joinPath(rootPath, 'next.config.ts'));
  const packageJsonPath = joinPath(rootPath, 'package.json');
  
  if (await fileExists(packageJsonPath)) {
    try {
      const packageJsonContent = await readFile(packageJsonPath);
      projectInfo.packageJson = JSON.parse(packageJsonContent);
      
      const hasNextDep = projectInfo.packageJson.dependencies?.next || 
                        projectInfo.packageJson.devDependencies?.next;
      
      projectInfo.isNextJs = (nextConfigJs || nextConfigTs) && !!hasNextDep;
      
      // Check for Tailwind CSS
      const hasTailwindDep = projectInfo.packageJson.dependencies?.tailwindcss ||
                            projectInfo.packageJson.devDependencies?.tailwindcss;
      projectInfo.hasTailwind = !!hasTailwindDep;
      
      if (projectInfo.isNextJs) {
        logger.debug('Detected Next.js project');
      }
      if (projectInfo.hasTailwind) {
        logger.debug('Detected Tailwind CSS');
      }
    } catch (error) {
      logger.debug('Failed to parse package.json:', error);
    }
  }

  // Check for shadcn/ui setup
  const componentsJsonPath = joinPath(rootPath, 'components.json');
  if (await fileExists(componentsJsonPath)) {
    try {
      const componentsJsonContent = await readFile(componentsJsonPath);
      projectInfo.componentsJson = JSON.parse(componentsJsonContent);
      projectInfo.hasShadcnUi = true;
      logger.debug('Detected shadcn/ui setup');
    } catch (error) {
      logger.debug('Failed to parse components.json:', error);
    }
  }

  if (!projectInfo.isNextJs) {
    return projectInfo;
  }

  // Check for App Router vs Pages Router
  const appDir = await directoryExists(joinPath(rootPath, 'app'));
  const pagesDir = await directoryExists(joinPath(rootPath, 'pages'));
  
  projectInfo.hasAppRouter = appDir;
  projectInfo.hasPages = pagesDir;

  if (projectInfo.hasAppRouter) {
    logger.debug('Detected App Router');
  } else if (projectInfo.hasPages) {
    logger.debug('Detected Pages Router');
  }

  // Check for existing admin routes
  if (projectInfo.hasAppRouter) {
    const adminDir = await directoryExists(joinPath(rootPath, 'app', 'admin'));
    const loginDir = await directoryExists(joinPath(rootPath, 'app', 'login'));
    projectInfo.hasExistingAdmin = adminDir || loginDir;
    
    if (projectInfo.hasExistingAdmin) {
      logger.debug('Found existing admin routes');
    }
  }

  if (projectInfo.hasPages) {
    const adminPage = await fileExists(joinPath(rootPath, 'pages', 'admin.tsx')) ||
                     await fileExists(joinPath(rootPath, 'pages', 'admin.js')) ||
                     await directoryExists(joinPath(rootPath, 'pages', 'admin'));
    const loginPage = await fileExists(joinPath(rootPath, 'pages', 'login.tsx')) ||
                     await fileExists(joinPath(rootPath, 'pages', 'login.js'));
    projectInfo.hasExistingAdmin = adminPage || loginPage;
  }

  return projectInfo;
}