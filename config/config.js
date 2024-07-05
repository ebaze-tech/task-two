//require('dotenv').config();

//module.exports = {
//  DB_NAME: process.env.DB_NAME,
//  DB_USER: process.env.DB_USER,
//  DB_PASSWORD: process.env.DB_PASSWORD,
//  DB_HOST: process.env.DB_HOST,
//  DB_DIALECT: process.env.DB_DIALECT
//};


require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
};
