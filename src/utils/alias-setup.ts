import { fileExists, readFile, writeFile } from './fs';
import { joinPath } from './fs';
import { logger } from './logger';

export async function setupPathAliases(rootPath: string, hasSrcFolder: boolean, hasSrcApp: boolean = false): Promise<boolean> {
  const tsConfigPath = joinPath(rootPath, 'tsconfig.json');
  const jsConfigPath = joinPath(rootPath, 'jsconfig.json');
  
  // Determine which config file to use/create
  let configPath: string;
  let configExists = false;
  
  if (await fileExists(tsConfigPath)) {
    configPath = tsConfigPath;
    configExists = true;
  } else if (await fileExists(jsConfigPath)) {
    configPath = jsConfigPath;
    configExists = true;
  } else {
    // Create tsconfig.json if neither exists
    configPath = tsConfigPath;
    configExists = false;
  }

  try {
    let config: any;
    
    if (configExists) {
      const configContent = await readFile(configPath);
      config = JSON.parse(configContent);
    } else {
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
    let aliasPath: string[];
    
    if (hasSrcApp) {
      // If using src/app, alias should point to src
      aliasPath = ["./src/*"];
    } else {
      // If using root app/, alias should point to root
      aliasPath = ["./*"];
    }
    
    if (!config.compilerOptions.paths) {
      config.compilerOptions.paths = {};
    }
    
    config.compilerOptions.paths["@/*"] = aliasPath;
    
    logger.debug(`Setting up alias "@/*": ${JSON.stringify(aliasPath)}`);

    // Also set baseUrl if not present
    if (!config.compilerOptions.baseUrl) {
      config.compilerOptions.baseUrl = ".";
    }

    // Write the updated config
    const configString = JSON.stringify(config, null, 2);
    await writeFile(configPath, configString);
    
    logger.success(`✅ Path aliases configured in ${configPath.split('/').pop()}`);
    return true;
    
  } catch (error) {
    logger.error(`Failed to setup path aliases: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}