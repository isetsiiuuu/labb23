require('dotenv').config();
const jwt = require('jsonwebtoken');



const authorization = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect('/');
    return res.status(403).json({ message: 'No cookie here!' });;
  }
  try {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('DATA I ACCESSTOKEN: ', data);
    req.userId = data.id;
    req.userRoles = data.roles;
    req.email = data.email;
    return next();
  } catch (e) {
    console.log('ERROR VERIFY TOKEN: ', e);
    return res.status(403).json({ message: "Hej1"});;
  }
};

const adminAuthorization = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect('/');
    return res.sendStatus(401).json({ message: 'Unauthorized!' });;
  }
  try {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!data.roles.includes('ADMIN_USER')) {
      return res.sendStatus(403).json({ message: 'Hej!' });;
    }
    req.userId = data.id;
    req.userRoles = data.roles;
    req.email = data.email;
    return next();
  } catch (e) {
    return res.sendsendStatus(401);
  }
};


module.exports = { authorization, adminAuthorization };