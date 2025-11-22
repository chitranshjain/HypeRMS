import fs from 'fs';

const logger = {
    LOG_LEVELS: {
        INFO: 'info',
        WARN: 'warn',
        ERROR: 'error',
        DEBUG: 'debug'
    },
    log: (level: string, message: string, filename = 'app.log') => {
        fs.appendFileSync(filename, `[${new Date().toISOString()}] [${level}] ${message}\n`);
    }
}

export { logger };