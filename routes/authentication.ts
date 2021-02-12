import { Router } from 'express';
import user  from "../database/index";
import passwordResetRequests from '../database/tables/pasword-reset-requests';
import {compare,hash} from "bcrypt";
import { createTransport } from 'nodemailer';
import { generate } from 'randomstring';
import errors from '../config/errors';
import {JsonError} from '../models/json-error';
import { emp } from '../database/tables/user';
import logger from '../logger';
import config from '../config/config';


const email= config.email;
const router = Router();
const transporter = createTransport({
	host: email.host,
	port: email.port,
	secure: email.secure,
	auth: {
		user: email.username,
		pass: email.password
	}
});

/** @api {post} /auth/signin request to the route authenticates and 
 * returns an error or logs the user and redirects to the dashboard
 * Parameter: 
 * 		emp_id
 * 		password
 * 
 * @api {get} /auth/signin takes the user to signin page
 * 
 * @api {post} /auth/signup adds a new user to the database
 * Parameter:
 * 		emp_id
 * 		manager
 * 		designation
 * 		fullname
 * 		department
 * 		revenue
 * 		password
 * 		email
 * @api {get} /auth/signup takes to the signup page
 * 
 * @api {get} /auth/forgotPassword creates a reset password request, generates a token and sends email to the user with link to reset password
 * parameter:
 * 		email
 * 
 * @api {post} /auth/resetPassword takes in the new password and sets it as password for the given emp_id and deletes the reset request
 * Parameter:
 * 		email
 * 		token
 * 		new password
 * */
router.post("/signin",async (req,res)=>{
	
    if(!req.body.emp_id){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"parameter provided is not correct"
		});
		// res.send("parameters not found")
        return;
    }
    const userPass = await emp.getPasswordByEmpId(parseInt(req.body.emp_id));
    if(userPass==null){
        res.json({
			success: false,
			error: "userNotFound",
			message: "no user with the given details found"
		});
		// res.send("did not find user")
		return;
	}
	
    // const match = await compare(req.body.password,userPass);

    // if(!match){
    //     res.json({
	// 		success: false,
	// 		error: "invalidPassword",
	// 		message: "invalid password recieved"
	// 	});
	// 	// res.send("wrong password")
	// 	return;
    // }
    if(userPass.match(req.body.password)){
		console.log("login success");// to check the user is logged in
		res.json({
			success: true,
		});
	}
	//redirect to the main page 
	//have a function to get all employees with signedIn manager
   

});

/*
* get request to /auth/signin to get to the signin page
*/
router.get("/signin",async (req,res)=>{
	//send the login page
});

/**
 * post request to the /auth/signup route to register a new employee
 * if parameters mismatch returns error
 */
router.post('/signup',async (req,res)=>{
	console.log(req.body);
    // create checks and add a user
    if(!req.body.emp_id){
        res.status(400).json({
            success: false,
            error: "wrongParameters",
            message:"input provided is wrong"
        });
        return;
    }
    const manager= req.body.manager ? req.body.manager:null;
    const emp_id= parseInt(req.body.emp_id);
    const designation = req.body.designation;
    const full_name = req.body.full_name;
    const department = req.body.department;
    const revenue = parseInt(req.body.revenue);
    const password = hash(req.body.password,10);
    const email = req.body.email;
    const usr = await emp.getUserById(emp_id);
    
    if(usr!=null){
        res.json({
			success: false,
			error:"userAlreadyExist",
			message: "user with given employee id already present try signin"
		});
		return;
    }
    await emp.addUser(emp_id,full_name,designation,manager,department,revenue,email,password); // add the user to the database
});

/**
 * get request to /auth/forgotPassword 
 * create a request for password change
 * send an email to the user with password change token and link
 */

router.get('/forgotPassword',async (req,res)=>{
	//open the form for forgot password
});

router.post('/forgotPassword', async (req, res, next) => {
	try {
		if (!req.body.email) {
			next(new JsonError(400, errors.wrongParameters));
			return;
		}

		const user = await emp.getUserByEmail(req.body.email);
		if (user == null) {
			next(new JsonError(200, errors.invalidEmail));
			return;
		}
		const userId = user.emp_id;

		const token = generate({
			length: 20,
			charset: 'alphabetic'
		});
		const tokenExpiry = Date.now() + (1000 * 60 * 60 * 24); // 24 hours

		await passwordResetRequests.add(userId, token, tokenExpiry);

		await transporter.sendMail({
			from: email.from,
			to: req.body.email,
			subject: 'Reset password',
			html: ''
		});

		res.json({
			success: true
		});

		logger.verbose(`${user.email} password reset email sent`);
	} catch (error) {
		next(new JsonError(500, error.message));
	}
});

router.get('/getEmpl/:emp_id',async (req,res,next)=>{
	try{
	const usr = emp.getUserById(parseInt(req.params.emp_id)).then(usr=>res.send(usr));
	}catch(err){
		next(new JsonError(500, err.message));
	}
});

router.post('/resetPassword', async (req, res, next) => {
	try {
		if (!req.body.token || !req.body.password) {
			next(new JsonError(400, errors.wrongParameters));
			return;
		}

		const passwordResetRequest = await passwordResetRequests.get(req.body.token);
		if (passwordResetRequest == null) {
			next(new JsonError(401, errors.tokenNotFound));
			return;
		}

		if (passwordResetRequest.tokenExpiry <= Date.now()) {
			next(new JsonError(401, errors.tokenExpired));
			return;
		}

		const passwordHash = await hash(req.body.password, config.passwordSaltRounds);
		await emp.updatePassword(passwordResetRequest.userId, passwordHash);
		await passwordResetRequests.delete(passwordResetRequest);

		await transporter.sendMail({
			from: email.from,
			to: req.body.email,
			subject: 'Password has been reset',
			html: 'Bruv, your password has been reset'
		});

		res.json({
			success: true
		});

		logger.verbose(`${req.body.email} password reset`);
	} catch (error) {
		next(new JsonError(500, error.message));
	}
});
export default router;