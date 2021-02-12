#!/usr/bin/env node
import app from "./app";
import { createServer } from 'http';
import initialize from './initialize';
import logger, { ensureLogsdirectory } from './logger';


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
	case 'EACCES':
		logger.error(bind + ' requires elevated privileges');
		process.exit(1);
	// eslint-disable-next-line no-fallthrough
	case 'EADDRINUSE':
		logger.error(bind + ' is already in use');
		process.exit(1);
	// eslint-disable-next-line no-fallthrough
	default:
		throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	logger.verbose('Listening on ' + bind + '...');
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
	const portNumber = parseInt(val, 10);

	if (isNaN(portNumber)) {
		// named pipe
		return val;
	}

	if (portNumber >= 0) {
		// port number
		return portNumber;
	}

	return false;
}

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
//create a server
const server = createServer(app);

// ensure log directory
try {
	ensureLogsdirectory();
} catch (error) {
	logger.error(error.message);
}


/**
 * Listen on provided port, on all network interfaces.
 */

initialize().then(() => {
	server.listen(port);
	server.on('error', onError);
	server.on('listening', onListening);
}).catch(error => {
	logger.error(error.message);
});
// server.listen(port);
// server.on('listening',onListening);
// server.listen(port);