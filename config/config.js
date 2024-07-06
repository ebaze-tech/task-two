require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: '1h',
    dialect: 'mysql',
  },
};
