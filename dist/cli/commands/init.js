"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const logger_1 = require("../../utils/logger");
const project_detector_1 = require("../../utils/project-detector");
const admin_panel_1 = require("../generators/admin-panel");
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
        if (!projectInfo.hasAppRouter) {
            logger_1.logger.error('This project is using Pages Router. ShadPanel requires App Router.');
            logger_1.logger.info('Run: npx @next/codemod@latest app-router-migration .');
            process.exit(1);
        }
        logger_1.logger.success(`Detected Next.js project with App Router`);
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
