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
exports.prompt = prompt;
exports.confirm = confirm;
const readline = __importStar(require("readline"));
async function prompt(options) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        const { message, defaultValue, type = 'input' } = options;
        let promptText = message;
        if (type === 'confirm') {
            promptText += defaultValue === 'y' ? ' (Y/n): ' : ' (y/N): ';
        }
        else if (defaultValue) {
            promptText += ` (${defaultValue}): `;
        }
        else {
            promptText += ': ';
        }
        rl.question(promptText, (answer) => {
            rl.close();
            if (type === 'confirm') {
                if (answer.trim() === '') {
                    resolve(defaultValue === 'y');
                }
                else {
                    resolve(answer.toLowerCase().startsWith('y'));
                }
            }
            else {
                resolve(answer.trim() || defaultValue || '');
            }
        });
    });
}
async function confirm(message, defaultValue = false) {
    const result = await prompt({
        message,
        defaultValue: defaultValue ? 'y' : 'n',
        type: 'confirm'
    });
    return result;
}
