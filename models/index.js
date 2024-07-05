const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Organisation = require('./organisation')(sequelize, Sequelize.DataTypes);

User.belongsToMany(Organisation, { through: 'UserOrganisation' });
Organisation.belongsToMany(User, {through: 'UserOrganisation'});

module.exports = {
    sequelize,
    User,
    Organisation
};