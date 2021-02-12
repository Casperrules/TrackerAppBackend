import { pool } from '../utils';

const metaData = {
	ensureTable: async (): Promise<void> => {
		await pool.query(`
            CREATE TABLE IF NOT EXISTS meta_data (
                id VARCHAR(100) PRIMARY KEY,
                value TEXT
            );`);
	},
	setVersion: async(version: string): Promise<void> => {
		await pool.query(`
            INSERT INTO
                meta_data
            VALUES
                ('version', ?)
            ON DUPLICATE KEY UPDATE
                value = ?
            `, [version, version]);
	},
	getVersion: async(): Promise<string> => {
		const rows = await pool.query('SELECT * FROM meta_data WHERE id = ?', ['version']);
		return rows.length === 0 ? '' : rows[0].value;
	}
};

export default metaData;