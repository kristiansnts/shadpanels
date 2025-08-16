"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminPanel = generateAdminPanel;
const logger_1 = require("../../utils/logger");
const fs_1 = require("../../utils/fs");
const template_processor_1 = require("../../utils/template-processor");
const path = __importStar(require("path"));
async function generateAdminPanel(projectInfo, options) {
    logger_1.logger.debug('Generating admin panel...');
    if (projectInfo.hasExistingAdmin && !options.force) {
        logger_1.logger.warn('Existing admin routes detected. Use --force to overwrite.');
        return;
    }
    const variables = (0, template_processor_1.getDefaultVariables)(options.appName || 'Admin Panel');
    const templatesDir = path.join(__dirname, '../../../src/templates');
    const projectRoot = projectInfo.rootPath;
    // Generate admin layout
    await generateFile((0, fs_1.joinPath)(templatesDir, 'app/admin/layout.tsx'), (0, fs_1.joinPath)(projectRoot, 'app/admin/layout.tsx'), variables, options);
    // Generate admin dashboard
    await generateFile((0, fs_1.joinPath)(templatesDir, 'app/admin/page.tsx'), (0, fs_1.joinPath)(projectRoot, 'app/admin/page.tsx'), variables, options);
    // Generate login layout
    await generateFile((0, fs_1.joinPath)(templatesDir, 'app/login/layout.tsx'), (0, fs_1.joinPath)(projectRoot, 'app/login/layout.tsx'), variables, options);
    // Generate login page
    await generateFile((0, fs_1.joinPath)(templatesDir, 'app/login/page.tsx'), (0, fs_1.joinPath)(projectRoot, 'app/login/page.tsx'), variables, options);
    logger_1.logger.success('Admin panel files generated successfully');
}
async function generateFile(templatePath, destinationPath, variables, options) {
    try {
        if (options.dryRun) {
            logger_1.logger.info(`Would generate: ${destinationPath}`);
            return;
        }
        const templateContent = await (0, fs_1.readFile)(templatePath);
        const processedContent = (0, template_processor_1.processTemplate)(templateContent, variables);
        const written = await (0, fs_1.writeFile)(destinationPath, processedContent, options.force);
        if (written) {
            logger_1.logger.success(`Generated: ${destinationPath}`);
        }
        else if (!options.force) {
            logger_1.logger.warn(`Skipped existing file: ${destinationPath}`);
        }
    }
    catch (error) {
        logger_1.logger.error(`Failed to generate ${destinationPath}:`, error instanceof Error ? error.message : String(error));
    }
}
