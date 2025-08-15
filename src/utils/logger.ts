export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

class Logger {
  private level: LogLevel = LogLevel.INFO;
  private verbose: boolean = false;

  setVerbose(verbose: boolean) {
    this.verbose = verbose;
    if (verbose) {
      this.level = LogLevel.DEBUG;
    }
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (level <= this.level) {
      const prefix = this.getPrefix(level);
      console.log(prefix + message, ...args);
    }
  }

  private getPrefix(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR:
        return '❌ ';
      case LogLevel.WARN:
        return '⚠️  ';
      case LogLevel.INFO:
        return '✅ ';
      case LogLevel.DEBUG:
        return '🔍 ';
    }
  }

  error(message: string, ...args: any[]) {
    this.log(LogLevel.ERROR, message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  success(message: string, ...args: any[]) {
    this.info(message, ...args);
  }
}

export const logger = new Logger();