//module.exports = (sequelize, DataTypes) => {
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Organisation = sequelize.define('Organisation', {
      orgId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
allowNull: true 
      },
    });

module.exports = Organisation;
  
    return Organisation;
  };
  
