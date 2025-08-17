"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectProject = detectProject;
const fs_1 = require("./fs");
const fs_2 = require("./fs");
const logger_1 = require("./logger");
async function detectProject(rootPath) {
    logger_1.logger.debug(`Detecting project at: ${rootPath}`);
    const projectInfo = {
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
    const nextConfigJs = await (0, fs_1.fileExists)((0, fs_2.joinPath)(rootPath, 'next.config.js'));
    const nextConfigTs = await (0, fs_1.fileExists)((0, fs_2.joinPath)(rootPath, 'next.config.ts'));
    const packageJsonPath = (0, fs_2.joinPath)(rootPath, 'package.json');
    if (await (0, fs_1.fileExists)(packageJsonPath)) {
        try {
            const packageJsonContent = await (0, fs_1.readFile)(packageJsonPath);
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
                logger_1.logger.debug('Detected Next.js project');
            }
            if (projectInfo.hasTailwind) {
                logger_1.logger.debug('Detected Tailwind CSS');
            }
            if (projectInfo.hasTypeScript) {
                logger_1.logger.debug('Detected TypeScript');
            }
            if (projectInfo.hasEslint) {
                logger_1.logger.debug('Detected ESLint');
            }
        }
        catch (error) {
            logger_1.logger.debug('Failed to parse package.json:', error);
        }
    }
    // Check for shadcn/ui setup
    const componentsJsonPath = (0, fs_2.joinPath)(rootPath, 'components.json');
    if (await (0, fs_1.fileExists)(componentsJsonPath)) {
        try {
            const componentsJsonContent = await (0, fs_1.readFile)(componentsJsonPath);
            projectInfo.componentsJson = JSON.parse(componentsJsonContent);
            projectInfo.hasShadcnUi = true;
            logger_1.logger.debug('Detected shadcn/ui setup');
        }
        catch (error) {
            logger_1.logger.debug('Failed to parse components.json:', error);
        }
    }
    if (!projectInfo.isNextJs) {
        return projectInfo;
    }
    // Check for App Router vs Pages Router with specific locations
    const appDir = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'app'));
    const srcAppDir = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'src', 'app'));
    const pagesDir = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'pages'));
    const srcPagesDir = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'src', 'pages'));
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
    }
    else if (projectInfo.hasAppRouter) {
        projectInfo.routerType = 'app';
    }
    else if (projectInfo.hasPages) {
        projectInfo.routerType = 'pages';
    }
    else {
        projectInfo.routerType = 'none';
    }
    // Determine app location
    if (projectInfo.hasRootApp) {
        projectInfo.appLocation = 'root';
    }
    else if (projectInfo.hasSrcApp) {
        projectInfo.appLocation = 'src';
    }
    else {
        projectInfo.appLocation = 'none';
    }
    // Enhanced logging
    if (projectInfo.routerType === 'app') {
        if (projectInfo.appLocation === 'src') {
            logger_1.logger.debug('Detected App Router in src/app');
        }
        else {
            logger_1.logger.debug('Detected App Router in root app/');
        }
    }
    else if (projectInfo.routerType === 'pages') {
        if (projectInfo.hasSrcPages) {
            logger_1.logger.debug('Detected Pages Router in src/pages');
        }
        else {
            logger_1.logger.debug('Detected Pages Router in root pages/');
        }
    }
    else if (projectInfo.routerType === 'mixed') {
        logger_1.logger.debug('Detected mixed App and Pages Router setup');
    }
    // Check for existing admin routes
    if (projectInfo.hasAppRouter) {
        let adminDir, loginDir;
        if (projectInfo.hasSrcApp) {
            adminDir = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'src', 'app', 'admin'));
            loginDir = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'src', 'app', 'login'));
        }
        else {
            adminDir = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'app', 'admin'));
            loginDir = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'app', 'login'));
        }
        projectInfo.hasExistingAdmin = adminDir || loginDir;
        if (projectInfo.hasExistingAdmin) {
            logger_1.logger.debug('Found existing admin routes');
        }
    }
    if (projectInfo.hasPages) {
        const adminPage = await (0, fs_1.fileExists)((0, fs_2.joinPath)(rootPath, 'pages', 'admin.tsx')) ||
            await (0, fs_1.fileExists)((0, fs_2.joinPath)(rootPath, 'pages', 'admin.js')) ||
            await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'pages', 'admin'));
        const loginPage = await (0, fs_1.fileExists)((0, fs_2.joinPath)(rootPath, 'pages', 'login.tsx')) ||
            await (0, fs_1.fileExists)((0, fs_2.joinPath)(rootPath, 'pages', 'login.js'));
        projectInfo.hasExistingAdmin = adminPage || loginPage;
    }
    // Check for src folder
    projectInfo.hasSrcFolder = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'src'));
    // Check for TypeScript/JavaScript config and path aliases
    const tsConfigPath = (0, fs_2.joinPath)(rootPath, 'tsconfig.json');
    const jsConfigPath = (0, fs_2.joinPath)(rootPath, 'jsconfig.json');
    if (await (0, fs_1.fileExists)(tsConfigPath)) {
        // Additional confirmation of TypeScript setup
        projectInfo.hasTypeScript = true;
        try {
            const tsConfigContent = await (0, fs_1.readFile)(tsConfigPath);
            projectInfo.tsConfigJson = JSON.parse(tsConfigContent);
            // Check for path aliases
            const paths = projectInfo.tsConfigJson?.compilerOptions?.paths;
            if (paths && paths['@/*']) {
                projectInfo.hasPathAlias = true;
                logger_1.logger.debug('Detected TypeScript path aliases');
            }
        }
        catch (error) {
            logger_1.logger.debug('Failed to parse tsconfig.json:', error);
        }
    }
    else if (await (0, fs_1.fileExists)(jsConfigPath)) {
        try {
            const jsConfigContent = await (0, fs_1.readFile)(jsConfigPath);
            projectInfo.tsConfigJson = JSON.parse(jsConfigContent);
            // Check for path aliases
            const paths = projectInfo.tsConfigJson?.compilerOptions?.paths;
            if (paths && paths['@/*']) {
                projectInfo.hasPathAlias = true;
                logger_1.logger.debug('Detected JavaScript path aliases');
            }
        }
        catch (error) {
            logger_1.logger.debug('Failed to parse jsconfig.json:', error);
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
        if (await (0, fs_1.fileExists)((0, fs_2.joinPath)(rootPath, configFile))) {
            projectInfo.hasEslint = true;
            logger_1.logger.debug(`Detected ESLint config: ${configFile}`);
            break;
        }
    }
    return projectInfo;
}
