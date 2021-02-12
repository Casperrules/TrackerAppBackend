const config = {
	hostName: '',
	basePath: '/',
	databaseVersion: '1.0.0',
	mysql: {
		user: 'root',
		host: 'localhost',
		port: 3306,
		password: 'root',//root
		database: 'tracker2'
	},
	jwtSecret: 'pajkatt',
	passwordSaltRounds: 10,
	email: {
		host: 'smtp.example.com',
		port: 587,
		secure: true,
		username: 'no-reply@example.com',
		from: 'Notification <no-reply@example.com>',
		password: 'password'
	}
};


export default config;