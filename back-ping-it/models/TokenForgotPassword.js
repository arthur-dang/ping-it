
const Sequelize = require('sequelize');


const sequelize = require('../sql_config');

module.exports = (sequelize, type) => {
    return sequelize.define('TokenForgotPassword', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        token_forgot_password: {
          type: type.STRING,
          unique: true,
        },
    },
  {timestamps: false})
};
