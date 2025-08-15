#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const package_json_1 = require("../../package.json");
const init_1 = require("./commands/init");
const program = new commander_1.Command();
program
    .name('shadpanel')
    .description('CLI tool for generating modern admin panels in Next.js projects')
    .version(package_json_1.version);
program
    .command('init')
    .description('Initialize an admin panel in your Next.js project')
    .option('--force', 'Overwrite existing files without prompting')
    .option('--skip-deps', 'Skip automatic dependency installation')
    .option('--app-name <name>', 'Set custom app name', 'Admin Panel')
    .option('--dry-run', 'Preview changes without writing files')
    .option('--verbose', 'Enable verbose logging')
    .action(init_1.initCommand);
program.parse();
