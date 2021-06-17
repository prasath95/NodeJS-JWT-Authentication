const jwt = require("jsonwebtoken");
const config = require('config');


module.exports = function (req, res, next) {

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  try {
    const decoded = jwt.verify(token, config.get("App.jwt.code"));
    req.user = decoded;

    // console.log( req.user.userId);
    // console.log( req.user.email);
    var userid= req.user.userId;
    next(userid);

  } catch (ex) {
    return res.status(400).json({ error: 'token invalid' })
  }
};