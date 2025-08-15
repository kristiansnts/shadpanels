#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../../package.json';
import { initCommand } from './commands/init';
import { logger } from '../utils/logger';

const program = new Command();

program
  .name('shadpanel')
  .description('CLI tool for generating modern admin panels in Next.js projects')
  .version(version);

program
  .command('init')
  .description('Initialize an admin panel in your Next.js project')
  .option('--force', 'Overwrite existing files without prompting')
  .option('--skip-deps', 'Skip automatic dependency installation')
  .option('--app-name <name>', 'Set custom app name', 'Admin Panel')
  .option('--dry-run', 'Preview changes without writing files')
  .option('--verbose', 'Enable verbose logging')
  .action(initCommand);

program.parse();