const Sequelize = require('sequelize');


const sequelize = require('../sql_config');

module.exports = (sequelize, type) => {
    return sequelize.define('apache_count', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        count: {
          type: type.INTEGER
        }
    },
  {timestamps: false})
}
