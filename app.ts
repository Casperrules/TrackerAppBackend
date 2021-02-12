import * as createError from 'http-errors';
import * as express from 'express';
import apiRouter from "./routes/index";
import * as cookieParser from 'cookie-parser';
import {emp} from "./database/tables/user";
import morgan = require('morgan');
import * as helmet from 'helmet';
import logger, {morganErrorStream, morganStream, morganWarnStream} from './logger';
import {JsonError} from './models/json-error';
import errors, {messages} from './config/errors'

const app = express();


let morganFormat = 'combined';
if (process.env.NODE_ENV != 'production') {
	morganFormat = 'dev';
	app.locals.pretty = true;
	app.set('json spaces', 4);
}

app.use(morgan(morganFormat, { stream: morganStream, skip: (req, res) => {
	return res.statusCode >= 400;
}}));
app.use(morgan(morganFormat, { stream: morganWarnStream, skip: (req, res) => {
	return res.statusCode < 400 || res.statusCode >= 500;
}}));
app.use(morgan(morganFormat, { stream: morganErrorStream, skip: (req, res) => {
	return res.statusCode < 500;
}}));

if (process.env.NODE_ENV == 'production') {
	app.use(helmet());
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

	next();
});


app.locals.pretty = true;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", (req, res, next) => {
	
	if (req.hostname === 'vicaratracker.co' || req.hostname === 'localhost') {//redefine hostname as per the hosted link
		apiRouter(req, res, next);
	}else {
		next();
	}
});

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
	next(new JsonError(404, errors.notFound));
});

// error handler
app.use((err: JsonError, req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (err.error && err.status) {
		res.status(err.status).json({
			success: false,
			error: messages[err.error] ? err.error : errors.serverError,
			message: messages[err.error] || messages[errors.serverError]
		});
	} else {
		res.status(err.status || 500);
		res.json({
			success: false,
			error: messages[err.error] ? err.error : errors.serverError,
			message: messages[err.error] || messages[errors.serverError]
		});
	}

	if (err.status >= 400 && err.status < 500) {
		logger.warn(messages[err.error] || err.error);
	} else if (err.status >= 500) {
		logger.error(messages[err.error] || err.error);
	} else {
		logger.verbose(messages[err.error] || err.error);
	}

	next();
});

app.get("/employees/:mng_id", (_req,_res,next)=>{
	const employees = emp.getEmployeesByManagerId(parseInt(_req.params.mng_id)).then(employees => {
		if(employees==null){
			_res.status(400).json({
				success: false,
				error: "no employees",
				message:"no employees found for the given manager id"
			});
			return;
		}
		_res.json(employees);
	});
	next();
});

app.get("/search/:emp_id",(_req,_res,next)=>{
	console.log(_req.params.emp_id);
	const usr = emp.getUserIfManagerLoggedin(_req.cookies.emp_id,parseInt(_req.params.emp_id)).then(usr=>{
		if(usr == null){
			_res.status(400).json({
				success: false,
				error: "wrongParameters",
				message:"parameter provided is not correct"
			});
			return;
		}
		_res.json(usr);
	});
	
	next();
})
export default app;