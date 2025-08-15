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
exports.fileExists = fileExists;
exports.directoryExists = directoryExists;
exports.ensureDirectory = ensureDirectory;
exports.copyFile = copyFile;
exports.writeFile = writeFile;
exports.readFile = readFile;
exports.joinPath = joinPath;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function fileExists(filePath) {
    try {
        await fs.promises.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
async function directoryExists(dirPath) {
    try {
        const stats = await fs.promises.stat(dirPath);
        return stats.isDirectory();
    }
    catch {
        return false;
    }
}
async function ensureDirectory(dirPath) {
    try {
        await fs.promises.mkdir(dirPath, { recursive: true });
    }
    catch (error) {
        if (error instanceof Error && 'code' in error && error.code !== 'EEXIST') {
            throw error;
        }
    }
}
async function copyFile(src, dest, force = false) {
    if (!force && await fileExists(dest)) {
        return false; // File exists and not forcing
    }
    await ensureDirectory(path.dirname(dest));
    await fs.promises.copyFile(src, dest);
    return true;
}
async function writeFile(filePath, content, force = false) {
    if (!force && await fileExists(filePath)) {
        return false; // File exists and not forcing
    }
    await ensureDirectory(path.dirname(filePath));
    await fs.promises.writeFile(filePath, content, 'utf8');
    return true;
}
async function readFile(filePath) {
    return fs.promises.readFile(filePath, 'utf8');
}
function joinPath(...paths) {
    return path.join(...paths);
}
