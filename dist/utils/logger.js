"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    constructor() {
        this.level = LogLevel.INFO;
        this.verbose = false;
    }
    setVerbose(verbose) {
        this.verbose = verbose;
        if (verbose) {
            this.level = LogLevel.DEBUG;
        }
    }
    log(level, message, ...args) {
        if (level <= this.level) {
            const prefix = this.getPrefix(level);
            console.log(prefix + message, ...args);
        }
    }
    getPrefix(level) {
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
    error(message, ...args) {
        this.log(LogLevel.ERROR, message, ...args);
    }
    warn(message, ...args) {
        this.log(LogLevel.WARN, message, ...args);
    }
    info(message, ...args) {
        this.log(LogLevel.INFO, message, ...args);
    }
    debug(message, ...args) {
        this.log(LogLevel.DEBUG, message, ...args);
    }
    success(message, ...args) {
        this.info(message, ...args);
    }
}
exports.logger = new Logger();
