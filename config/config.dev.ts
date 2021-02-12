
export const port = '3000';
export const basePath = '/';
export const passwordSaltRounds = 10;


export const mysql = {
	host: 'localhost',
	port: 3306,
	user: 'user',
	password: 'user',
	database: 'tracker',
	connectionLimit: 10
};


export const email = {
	host: 'smtp.example.com',
	port: 587,
	secure: true,
	username: 'no-reply@example.com',
	from: 'Notification <no-reply@example.com>',
	password: 'password'
};