import * as mysql from 'promise-mysql';
import  config from '../config/config';

const mysqlConfig = config.mysql;
const poolCreationPromise = mysql.createPool(mysqlConfig);
let formedPool: mysql.Pool;

export let pool = {
	async query(query: string, args: any[] = []): Promise<any> {
		if (poolCreationPromise.isResolved() === false) {
			formedPool = await poolCreationPromise;
		}
		return formedPool.query(query, args);
	}
};
