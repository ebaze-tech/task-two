const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.',
    });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token! Please log in again.',
      });
    }

    req.user = decoded;
    next();
  });
};



















const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      status: 'Unauthorized',
      message: 'Access denied. No token provided.',
      statusCode: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Invalid token.',
      statusCode: 400,
    });
  }
};
