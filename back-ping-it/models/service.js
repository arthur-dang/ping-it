const Sequelize = require('sequelize');


const sequelize = require('../sql_config');

module.exports = (sequelize, type) => {
    return sequelize.define('service', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        service: {
          type: type.STRING,
          unique:true
        }
    },
  {timestamps: false})
}
