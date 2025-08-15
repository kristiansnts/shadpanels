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
            if (projectInfo.isNextJs) {
                logger_1.logger.debug('Detected Next.js project');
            }
        }
        catch (error) {
            logger_1.logger.debug('Failed to parse package.json:', error);
        }
    }
    if (!projectInfo.isNextJs) {
        return projectInfo;
    }
    // Check for App Router vs Pages Router
    const appDir = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'app'));
    const pagesDir = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'pages'));
    projectInfo.hasAppRouter = appDir;
    projectInfo.hasPages = pagesDir;
    if (projectInfo.hasAppRouter) {
        logger_1.logger.debug('Detected App Router');
    }
    else if (projectInfo.hasPages) {
        logger_1.logger.debug('Detected Pages Router');
    }
    // Check for existing admin routes
    if (projectInfo.hasAppRouter) {
        const adminDir = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'app', 'admin'));
        const loginDir = await (0, fs_1.directoryExists)((0, fs_2.joinPath)(rootPath, 'app', 'login'));
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
    return projectInfo;
}
