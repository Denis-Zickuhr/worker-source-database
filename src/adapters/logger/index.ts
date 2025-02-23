import { injectable } from 'inversify';
import winston from 'winston';

interface LogContext {
    [key: string]: any;
}

@injectable()
class Logger {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message, context }) => {
                    let contextStr = '';
                    if (context && Object.keys(context).length > 0) {
                        contextStr = ' ' + Object.entries(context).map(([key, value]) => `${key}=${value}`).join(' ');
                    }

                    return `[${level.toUpperCase()}] ${timestamp}${contextStr} ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console({}),
            ],
        });
    }

    private logWithContext(level: string, message: string, context?: LogContext) {
        const logMessage = {
            level,
            message,
            context,
            timestamp: new Date().toISOString(),
        };

        this.logger.log(logMessage);
    }

    info(message: string, context?: LogContext): void {
        this.logWithContext('info', message, context);
    }

    debug(message: string, context?: LogContext): void {
        this.logWithContext('debug', message, context);
    }

    warn(message: string, context?: LogContext): void {
        this.logWithContext('warn', message, context);
    }

    error(message: string, context?: LogContext): void {
        this.logWithContext('error', message, context);
    }
}

export default Logger;
