const Sequelize = require('sequelize');

const sequelize = new Sequelize('pingit', 'back', 'back', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,

  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  });

module.exports = sequelize