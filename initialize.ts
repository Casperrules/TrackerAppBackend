import database from './database/database';
import logger from './logger';

export default async function initialize(): Promise<void> {
	logger.verbose('Initializing...');
	await database.initialize();
}