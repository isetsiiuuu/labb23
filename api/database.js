const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	port: process.env.DB_PORT,

});
let db = {};


db.getUserByEmail = (email) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM Users WHERE email = ?';
		const query = mysql.format(sql, [email]);
		console.log("query", query)
		pool.query(query, (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result[0]);
		});
	});
};

db.getUsers = () => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM Users';
		const query = mysql.format(sql);
		pool.query(query, (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
};


db.initRoles = () => {
	const sql = 'INSERT INTO Roles (roleId, rolename) VALUES ?';
	const query = mysql.format(sql, [
		[
			[1000, 'NORMAL'],
			[2000, 'ADMIN']
		],
	]);
	pool.query(query, (err) => {
		if (err) {
			console.log('ERROR Inserting Roles', err);
		} else {
			console.log('Inserted Roles successfully', err);
		}
	});
};


db.getUsersAdmin = () => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT userId, email, username FROM Users';
		const query = mysql.format(sql);
		pool.query(query, (err, result) => {
			if (err) {
				console.log("err", err)
				return reject(err);
			}
			return resolve(result);
		});
	});
};


db.getUserById = (userId) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT userId, email, username FROM Users WHERE userId = ?';
		const query = mysql.format(sql, [userId]);
		pool.query(query, (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result[0]);
		});
	});
};

db.createUser = (username, email, password) => {
	return new Promise((resolve, reject) => {
		const sql =
			'INSERT INTO Users (userId,username, email, password) VALUES (?)';
		const query = mysql.format(sql, [[null, username, email, password]]);
		pool.query(query, async (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result.insertId);
		});
	});
};

db.assignRoleToUser = (userId, roleId) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO UsersWithRoles (userId, roleId) VALUES (?)';
		const query = mysql.format(sql, [[userId, roleId]]);
		pool.query(query, async (err, result) => {
			if (err) {
				return reject(err);
			}
			console.log(result);
			return resolve(result);
		});
	});
};

db.getRolesForUser = (userId) => {
	return new Promise((resolve, reject) => {
		const sql =
			'SELECT Roles.rolename, Roles.roleId FROM UsersWithRoles INNER JOIN Roles ON Roles.roleId = UsersWithRoles.roleId WHERE UsersWithRoles.userId = ?';
		const query = mysql.format(sql, [userId]);
		pool.query(query, async (err, result) => {
			if (err) {
				return reject(err);
			}
			console.log(result);
			return resolve(result);
		});
	});
};

module.exports = db;
