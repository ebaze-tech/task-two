//const {Sequelize} = require('sequelize');
//const sequelize = require('../config/database');

//const User = require('./user')(sequelize, Sequelize.DataTypes);
//const Organisation = require('./organisation')(sequelize, Sequelize.DataTypes);

//User.belongsToMany(Organisation, { through: 'UserOrganisation' });
//Organisation.belongsToMany(User, {through: 'UserOrganisation'});

//module.exports = {
//    sequelize,
//    User,
//    Organisation
//};


const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: 'mysql',
  }
);

const User = require('./user')(sequelize);
const Organisation = require('./organisation')(sequelize);

// Define relationships
User.belongsToMany(Organisation, { through: 'UserOrganisations' });
Organisation.belongsToMany(User, { through: 'UserOrganisations' });

sequelize.sync();

module.exports = { sequelize, User, Organisation };
