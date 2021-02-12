import {pool} from '../utils';
import {PasswordResetRequest} from '../../models/password-reset-request';

const passwordResetRequests = {
	ensureTable: async (): Promise<void> => {
		await pool.query(`
            CREATE TABLE IF NOT EXISTS password_reset_requests
            (
                emp_id      VARCHAR(36) PRIMARY KEY,
                token       VARCHAR(64) UNIQUE,
                tokenexpiry BIGINT
            );`);
	},
	add: async (userId: PasswordResetRequest['userId'], token: PasswordResetRequest['token'], tokenExpiry: PasswordResetRequest['tokenExpiry']): Promise<void> => {
		await pool.query('INSERT INTO password_reset_requests VALUES (?, SHA2(?, 256), ?) ON DUPLICATE KEY UPDATE token = SHA2(?, 256), tokenexpiry = ?;', [userId, token, tokenExpiry, token, tokenExpiry]);
	},
	get: async (token: PasswordResetRequest['token']): Promise<PasswordResetRequest> => {
		const rows = await pool.query('SELECT * FROM password_reset_requests WHERE token = SHA2(?, 256);', [token]);
		return rows.length === 0 ? null : rows[0];
	},
	delete: async (passwordResetRequest: PasswordResetRequest): Promise<void> => {
		await pool.query('DELETE FROM password_reset_requests WHERE userid = ?;', [passwordResetRequest.userId]);
	}
};

export default passwordResetRequests;