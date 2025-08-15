import * as fs from 'fs';
import * as path from 'path';

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.promises.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code !== 'EEXIST') {
      throw error;
    }
  }
}

export async function copyFile(src: string, dest: string, force: boolean = false): Promise<boolean> {
  if (!force && await fileExists(dest)) {
    return false; // File exists and not forcing
  }

  await ensureDirectory(path.dirname(dest));
  await fs.promises.copyFile(src, dest);
  return true;
}

export async function writeFile(filePath: string, content: string, force: boolean = false): Promise<boolean> {
  if (!force && await fileExists(filePath)) {
    return false; // File exists and not forcing
  }

  await ensureDirectory(path.dirname(filePath));
  await fs.promises.writeFile(filePath, content, 'utf8');
  return true;
}

export async function readFile(filePath: string): Promise<string> {
  return fs.promises.readFile(filePath, 'utf8');
}

export function joinPath(...paths: string[]): string {
  return path.join(...paths);
}