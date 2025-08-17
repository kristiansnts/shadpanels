import * as readline from 'readline';

export interface PromptOptions {
  message: string;
  defaultValue?: string;
  type?: 'confirm' | 'input';
}

export async function prompt(options: PromptOptions): Promise<string | boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const { message, defaultValue, type = 'input' } = options;
    
    let promptText = message;
    if (type === 'confirm') {
      promptText += defaultValue === 'y' ? ' (Y/n): ' : ' (y/N): ';
    } else if (defaultValue) {
      promptText += ` (${defaultValue}): `;
    } else {
      promptText += ': ';
    }

    rl.question(promptText, (answer) => {
      rl.close();
      
      if (type === 'confirm') {
        if (answer.trim() === '') {
          resolve(defaultValue === 'y');
        } else {
          resolve(answer.toLowerCase().startsWith('y'));
        }
      } else {
        resolve(answer.trim() || defaultValue || '');
      }
    });
  });
}

export async function confirm(message: string, defaultValue: boolean = false): Promise<boolean> {
  const result = await prompt({
    message,
    defaultValue: defaultValue ? 'y' : 'n',
    type: 'confirm'
  });
  return result as boolean;
}