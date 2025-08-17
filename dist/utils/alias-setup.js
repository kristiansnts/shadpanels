"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPathAliases = setupPathAliases;
const fs_1 = require("./fs");
const fs_2 = require("./fs");
const logger_1 = require("./logger");
async function setupPathAliases(rootPath, hasSrcFolder, hasSrcApp = false) {
    const tsConfigPath = (0, fs_2.joinPath)(rootPath, 'tsconfig.json');
    const jsConfigPath = (0, fs_2.joinPath)(rootPath, 'jsconfig.json');
    // Determine which config file to use/create
    let configPath;
    let configExists = false;
    if (await (0, fs_1.fileExists)(tsConfigPath)) {
        configPath = tsConfigPath;
        configExists = true;
    }
    else if (await (0, fs_1.fileExists)(jsConfigPath)) {
        configPath = jsConfigPath;
        configExists = true;
    }
    else {
        // Create tsconfig.json if neither exists
        configPath = tsConfigPath;
        configExists = false;
    }
    try {
        let config;
        if (configExists) {
            const configContent = await (0, fs_1.readFile)(configPath);
            config = JSON.parse(configContent);
        }
        else {
            // Create basic Next.js tsconfig.json
            config = {
                compilerOptions: {
                    target: "es5",
                    lib: ["dom", "dom.iterable", "es6"],
                    allowJs: true,
                    skipLibCheck: true,
                    strict: true,
                    noEmit: true,
                    esModuleInterop: true,
                    module: "esnext",
                    moduleResolution: "bundler",
                    resolveJsonModule: true,
                    isolatedModules: true,
                    jsx: "preserve",
                    incremental: true,
                    plugins: [
                        {
                            name: "next"
                        }
                    ]
                },
                include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
                exclude: ["node_modules"]
            };
        }
        // Ensure compilerOptions exists
        if (!config.compilerOptions) {
            config.compilerOptions = {};
        }
        // Set up path aliases based on project structure
        let aliasPath;
        if (hasSrcApp) {
            // If using src/app, alias should point to src
            aliasPath = ["./src/*"];
        }
        else {
            // If using root app/, alias should point to root
            aliasPath = ["./*"];
        }
        if (!config.compilerOptions.paths) {
            config.compilerOptions.paths = {};
        }
        config.compilerOptions.paths["@/*"] = aliasPath;
        logger_1.logger.debug(`Setting up alias "@/*": ${JSON.stringify(aliasPath)}`);
        // Also set baseUrl if not present
        if (!config.compilerOptions.baseUrl) {
            config.compilerOptions.baseUrl = ".";
        }
        // Write the updated config
        const configString = JSON.stringify(config, null, 2);
        await (0, fs_1.writeFile)(configPath, configString);
        logger_1.logger.success(`✅ Path aliases configured in ${configPath.split('/').pop()}`);
        return true;
    }
    catch (error) {
        logger_1.logger.error(`Failed to setup path aliases: ${error instanceof Error ? error.message : String(error)}`);
        return false;
    }
}
