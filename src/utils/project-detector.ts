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
  hasTypeScript: boolean;
  hasEslint: boolean;
  hasPathAlias: boolean;
  hasSrcFolder: boolean;
  hasSrcApp: boolean;
  hasSrcPages: boolean;
  hasRootApp: boolean;
  hasRootPages: boolean;
  routerType: 'app' | 'pages' | 'mixed' | 'none';
  appLocation: 'root' | 'src' | 'none';
  rootPath: string;
  packageJson?: any;
  componentsJson?: any;
  tsConfigJson?: any;
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
    hasTypeScript: false,
    hasEslint: false,
    hasPathAlias: false,
    hasSrcFolder: false,
    hasSrcApp: false,
    hasSrcPages: false,
    hasRootApp: false,
    hasRootPages: false,
    routerType: 'none',
    appLocation: 'none',
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
      
      // Check for TypeScript
      const hasTypeScriptDep = projectInfo.packageJson.dependencies?.typescript ||
                              projectInfo.packageJson.devDependencies?.typescript;
      projectInfo.hasTypeScript = !!hasTypeScriptDep;
      
      // Check for ESLint
      const hasEslintDep = projectInfo.packageJson.dependencies?.eslint ||
                          projectInfo.packageJson.devDependencies?.eslint;
      projectInfo.hasEslint = !!hasEslintDep;
      
      if (projectInfo.isNextJs) {
        logger.debug('Detected Next.js project');
      }
      if (projectInfo.hasTailwind) {
        logger.debug('Detected Tailwind CSS');
      }
      if (projectInfo.hasTypeScript) {
        logger.debug('Detected TypeScript');
      }
      if (projectInfo.hasEslint) {
        logger.debug('Detected ESLint');
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

  // Check for App Router vs Pages Router with specific locations
  const appDir = await directoryExists(joinPath(rootPath, 'app'));
  const srcAppDir = await directoryExists(joinPath(rootPath, 'src', 'app'));
  const pagesDir = await directoryExists(joinPath(rootPath, 'pages'));
  const srcPagesDir = await directoryExists(joinPath(rootPath, 'src', 'pages'));
  
  // Set specific location flags
  projectInfo.hasRootApp = appDir;
  projectInfo.hasSrcApp = srcAppDir;
  projectInfo.hasRootPages = pagesDir;
  projectInfo.hasSrcPages = srcPagesDir;
  
  // Set general flags for compatibility
  projectInfo.hasAppRouter = appDir || srcAppDir;
  projectInfo.hasPages = pagesDir || srcPagesDir;
  
  // Determine router type and app location
  if (projectInfo.hasAppRouter && projectInfo.hasPages) {
    projectInfo.routerType = 'mixed';
  } else if (projectInfo.hasAppRouter) {
    projectInfo.routerType = 'app';
  } else if (projectInfo.hasPages) {
    projectInfo.routerType = 'pages';
  } else {
    projectInfo.routerType = 'none';
  }
  
  // Determine app location
  if (projectInfo.hasRootApp) {
    projectInfo.appLocation = 'root';
  } else if (projectInfo.hasSrcApp) {
    projectInfo.appLocation = 'src';
  } else {
    projectInfo.appLocation = 'none';
  }

  // Enhanced logging
  if (projectInfo.routerType === 'app') {
    if (projectInfo.appLocation === 'src') {
      logger.debug('Detected App Router in src/app');
    } else {
      logger.debug('Detected App Router in root app/');
    }
  } else if (projectInfo.routerType === 'pages') {
    if (projectInfo.hasSrcPages) {
      logger.debug('Detected Pages Router in src/pages');
    } else {
      logger.debug('Detected Pages Router in root pages/');
    }
  } else if (projectInfo.routerType === 'mixed') {
    logger.debug('Detected mixed App and Pages Router setup');
  }

  // Check for existing admin routes
  if (projectInfo.hasAppRouter) {
    let adminDir, loginDir;
    
    if (projectInfo.hasSrcApp) {
      adminDir = await directoryExists(joinPath(rootPath, 'src', 'app', 'admin'));
      loginDir = await directoryExists(joinPath(rootPath, 'src', 'app', 'login'));
    } else {
      adminDir = await directoryExists(joinPath(rootPath, 'app', 'admin'));
      loginDir = await directoryExists(joinPath(rootPath, 'app', 'login'));
    }
    
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

  // Check for src folder
  projectInfo.hasSrcFolder = await directoryExists(joinPath(rootPath, 'src'));
  
  // Check for TypeScript/JavaScript config and path aliases
  const tsConfigPath = joinPath(rootPath, 'tsconfig.json');
  const jsConfigPath = joinPath(rootPath, 'jsconfig.json');
  
  if (await fileExists(tsConfigPath)) {
    // Additional confirmation of TypeScript setup
    projectInfo.hasTypeScript = true;
    
    try {
      const tsConfigContent = await readFile(tsConfigPath);
      projectInfo.tsConfigJson = JSON.parse(tsConfigContent);
      
      // Check for path aliases
      const paths = projectInfo.tsConfigJson?.compilerOptions?.paths;
      if (paths && paths['@/*']) {
        projectInfo.hasPathAlias = true;
        logger.debug('Detected TypeScript path aliases');
      }
    } catch (error) {
      logger.debug('Failed to parse tsconfig.json:', error);
    }
  } else if (await fileExists(jsConfigPath)) {
    try {
      const jsConfigContent = await readFile(jsConfigPath);
      projectInfo.tsConfigJson = JSON.parse(jsConfigContent);
      
      // Check for path aliases
      const paths = projectInfo.tsConfigJson?.compilerOptions?.paths;
      if (paths && paths['@/*']) {
        projectInfo.hasPathAlias = true;
        logger.debug('Detected JavaScript path aliases');
      }
    } catch (error) {
      logger.debug('Failed to parse jsconfig.json:', error);
    }
  }
  
  // Check for ESLint config files
  const eslintConfigs = [
    '.eslintrc.js',
    '.eslintrc.json', 
    '.eslintrc.yaml',
    '.eslintrc.yml',
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs'
  ];
  
  for (const configFile of eslintConfigs) {
    if (await fileExists(joinPath(rootPath, configFile))) {
      projectInfo.hasEslint = true;
      logger.debug(`Detected ESLint config: ${configFile}`);
      break;
    }
  }

  return projectInfo;
}