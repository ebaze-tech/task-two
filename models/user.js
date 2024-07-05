// module.exports = (sequelize, DataTypes) => {
   // const User = sequelize.define('User', {
    //  userId: {
     //   type: DataTypes.STRING,
     //   unique: true,
    //    allowNull: false,
     // },
    //  firstName: {
    //    type: DataTypes.STRING,
    //    allowNull: false,
    //  },
    //  lastName: {
     //   type: DataTypes.STRING,
    //    allowNull: false,
    //  },
    //  email: {
     //   type: DataTypes.STRING,
     //   unique: true,
       // allowNull: false,
    //  },
     // password: {
      //  type: DataTypes.STRING,
     //   allowNull: false,
   //   },
    //  phone: {
       // type: DataTypes.STRING,
     // },
    //});
  
   // return User;
//  };
//}*

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = User;
