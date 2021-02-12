import * as appRoot from 'app-root-path';
import * as winston from 'winston';
import morgan = require('morgan');
import { FileTransportOptions, ConsoleTransportOptions } from 'winston/lib/winston/transports';
import { ensureDirSync } from 'fs-extra-promise';
import { join } from 'path';

const logsDirectoryPath = join(appRoot.path, 'logs');

const logFormatConsole = winston.format.combine(
	winston.format.colorize(),
	winston.format.timestamp(),
	winston.format.printf((info) => {
		return `${new Date(info.timestamp).toLocaleString()} [${info.level}]: ${info.message}`;
	}));

const logFormatFile = winston.format.combine(
	winston.format.timestamp(),
	winston.format.printf((info) => {
		return `${new Date(info.timestamp).toLocaleString()} [${info.level}]: ${info.message}`;
	}));
	

const fileOptions: FileTransportOptions = {
	level: 'info',
	filename: join(logsDirectoryPath, 'app.log'),
	handleExceptions: true,
	maxsize: 5242880, // 5MB
	maxFiles: 5,
	silent: process.env.NODE_ENV !== 'production',
	format: logFormatFile,
};

const consoleOptions: ConsoleTransportOptions = {
	level: 'debug',
	handleExceptions: true,
	silent: process.env.NODE_ENV === 'production',
	format: logFormatConsole
};

export function ensureLogsdirectory(): void {
	ensureDirSync(logsDirectoryPath);
}

const logger = winston.createLogger({
	transports: [
		new winston.transports.File(fileOptions),
		new winston.transports.Console(consoleOptions)
	],
	exitOnError: false, // do not exit on handled exceptions
});

export const morganStream: morgan.StreamOptions = {
	write: (message) => {
		logger.info(message.trimEnd());
	}
};

export const morganWarnStream: morgan.StreamOptions = {
	write: (message) => {
		logger.warn(message.trimEnd());
	}
};

export const morganErrorStream: morgan.StreamOptions = {
	write: (message) => {
		logger.error(message.trimEnd());
	}
};

export default logger;