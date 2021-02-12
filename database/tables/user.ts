import { pool } from '../utils';
import { PasswordResetRequest } from '../../models/password-reset-request';
// import { employee } from '../../models/User';
// import {query} from '../utils';
import {employee} from '../../models/User';
import {v4} from 'uuid';

export const emp = {
    ensureTable: async (): Promise<void> => {
        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS employee (
                emp_id INT(16) NOT NULL,
                full_name VARCHAR(20), 
                designation VARCHAR(50),
                manager INT(16),
                department VARCHAR(50),
                revenue INT(10),
                email VARCHAR(30),
                password VARCHAR(50),
                PRIMARY KEY(emp_id)
            );
            `
        );
    },
    addUser: async (emp_id: employee['emp_id'],full_name: employee['full_name'],designation: string,manager: string,
        department: string,revenue: number,email:string, password: Promise<string>):Promise<void>=>{
            let exists = true;
		while (exists) {
			const rows = await pool.query('SELECT * FROM employee WHERE emp_id = ?;', [emp_id]);
			exists = rows.length !== 0;
        }
        console.log("adding user");
            await pool.query(
                `INSERT INTO employee (emp_id,full_name,designation,manager,department,revenue,email,password) VALUES (?,?,?,?,?,?,?,?);`,
                [emp_id,full_name,designation,manager,department,revenue,email,password]
                );
    },
    getPasswordByEmpId: async (emp_id:employee['emp_id']):Promise<string>=>{
        const rows = await pool.query(
			`
            SELECT password FROM employee WHERE
                emp_id = ?
            `,
			[emp_id]
        );
		return rows.length === 0 ? null : rows[0].password;
    },

    getUserById : async (emp_id:employee['emp_id']):Promise<employee>=>{
        const rows = await pool.query(
			`
            SELECT * FROM employee WHERE
                emp_id = ?
            `,
			[emp_id]
		);
		return rows.length === 0 ? null : rows[0];
    },
    getEmployeesByManagerId : async (manager:employee['manager']):Promise<employee>=>{
        const rows = await pool.query(
			`
            SELECT * FROM employee WHERE
                manager = ?
            `,
			[manager]
		);
		return rows.length === 0 ? null : rows[0];
    },
    getUserByEmail: async (email:employee['email']): Promise<employee>=>{
        const rows = await pool.query(
			`
            SELECT * FROM employee WHERE
                email = ?
            `,
			[email]
		);
		return rows.length === 0 ? null : rows[0];
    },
    updatePassword: async (id: employee['emp_id'], password: employee['password']): Promise<void> => {
		await pool.query('UPDATE employee SET password = ? WHERE id = ?;', [password, id]);
    },
    
    update: async (user: employee): Promise<void> => {
		let sqlQuery = 'UPDATE employee SET' + ' ';
		let firstQuery = true;
		const params = [];

		Object.entries(user).map(entry => {
			if (firstQuery !== true) {
				sqlQuery += ', ';
			}
			firstQuery = false;
			sqlQuery += `${entry[0].toLowerCase()} = ?`;
			params.push(entry[1]);
		});

		sqlQuery += ' WHERE id = ?;';
		params.push(user.emp_id);

		await pool.query(sqlQuery, params);
	},
    getUserIfManagerLoggedin: async (manager_id:employee['manager'],empl_id:employee['emp_id']):Promise<employee>=>{
        const usr = await pool.query("SELECT * FROM employee WHERE emp_id=? AND manager=? ;",[empl_id,manager_id]);
        return usr==null? "null":usr;
    }

}
