import logger from '../logger';
import {emp} from "./tables/user";
import {sensor} from "./tables/SensorData";
import passwordResetRequests from './tables/pasword-reset-requests';
import metaData from "./tables/meta-data";
import {device} from "./tables/device";
import config from '../config/config';

const tables=[
    emp,
    sensor,
	passwordResetRequests,
	metaData,
	device
];

const database = {
	async initialize(): Promise<void> {
		logger.verbose('Initializing database...');
		await database.ensureTables();

		const existingVersion = await metaData.getVersion();
		if (existingVersion !== config.databaseVersion) {
			await database.upgrade(existingVersion);
		}
	},
	ensureTables: async ():  Promise<void> => {
		for (const table of tables) {
			await table.ensureTable();
		}
	},
	upgrade: async (existingVersion: string): Promise<void> => {
		// Perform upgrade here
		await metaData.setVersion(config.databaseVersion);
	}
};

export default database;