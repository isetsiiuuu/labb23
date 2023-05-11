const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { authorization, adminAuthorization } = require('./middleware/auth');
const { application } = require('express');
const { json } = require('body-parser');
const db = require('./database');
require('dotenv').config();


const app = express();

const port = process.env.PORT;
const tokenSecret = process.env.ACCESS_TOKEN_SECRET;

const whitelist = ['http://localhost:3000'];

app.use(cookieParser());
app.use(cors({ credentials: true, origin: whitelist, optionSuccessStatus: 200, }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	next()
})


app.post('/api/login', async (req, res) => {
	try {

		const email = req.body.email;
		let password = req.body.password;

		const user = await db.getUserByEmail(email);
		if (!user) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}


		if (!(await bcrypt.compare(password, user.password))) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}

		const roles = await db.getRolesForUser(user.userId);
		
		const token = jwt.sign(
			{ email: email, id: user.userId, roles: roles.map((val) => val.rolename) },
			tokenSecret,
			{
				audience: 'http://localhost:3000',
				expiresIn: '15m',
				issuer: user.username,
			}
		);
		return res
			.cookie('token', token, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
			})
			.status(201)
			.json({
				userId: user.userId,
				email: email,
				username: user.username,
				roles: roles.map((val) => val.rolename),
			});

	} catch (err) {
		console.log('Error trying login: ', err);
		return res.sendStatus(400);
	}
});


// forAdmin
app.get('/api/users', adminAuthorization, async (req, res) => {
	try {
		const users = await db.getUsersAdmin();
		return res.status(200).json(users);
	} catch (err) {
		console.log('Error getting users');
		return res.sendStatus(400);
	}
});





app.get('/api/role', authorization, (req, res) => {
	console.log('----LOGGEDINAPI-----');
	const token = req.cookies.token;
	const tokenObj = { loggedInWithToken: false };

	try {

		const data = jwt.verify(token, tokenSecret);

		console.log(data);

		if (data) {
			tokenObj.loggedInWithToken = true;
			tokenObj.data = data;
		}


	} catch (error) {
		tokenObj.errorMessage = 'Token expired';
	}

	res.json(tokenObj);

});


//for user registration
app.post('/api/register', async (req, res) => {

	try {
		const username = req.body.username;
		const email = req.body.email;
		let password = req.body.password;

		
		if (!username || !email || !password) {
			return res.sendStatus(400);
		}

		const user = await db.getUserByEmail(email);
		if (user) {
			return res.status(409).json({ message: 'User already exists' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const userId = await db.createUser(username, email, hashedPassword);
		
		await db.assignRoleToUser(userId, 1000);
		//await db.assignRoleToUser(userId, 2000);
		res.status(200).json({ data: userId, status: 200, message: "User is created!" })

	} catch (err) {
		console.log('Error in register route: ', err);
		res.sendStatus(400);
	}
});

//for admin registration
app.post('/api/admin/register', async (req, res) => {

	try {
		const username = req.body.username;
		const email = req.body.email;
		let password = req.body.password;

		
		if (!username || !email || !password) {
			return res.sendStatus(400);
		}

		const user = await db.getUserByEmail(email);
		if (user) {
			return res.status(409).json({ message: 'Admin already exists' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const userId = await db.createUser(username, email, hashedPassword);
		
		await db.assignRoleToUser(userId, 2000);
		res.status(200).json({ data: userId, status: 200, message: "Admin is created!" })

	} catch (err) {
		console.log('Error in register route: ', err);
		res.sendStatus(400);
	}
});




app.get('/api/logout', (req, res) => {
	res.clearCookie("token").status(200).json({ message: "Logged out" });
	res.end();
});



app.listen(port, (err) => {
	if (err) {
		console.log(`Error listening on port: ${port}`, err);
	} else {
		console.log(`Succesfully listening on port: ${port}!`);
	}
});
