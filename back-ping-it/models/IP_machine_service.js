
const Sequelize = require('sequelize');


const sequelize = require('../sql_config');

module.exports = (sequelize, type) => {
    return sequelize.define('IP_machine_service', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        warning: {
          type: type.BOOLEAN,
        },
    },
  {timestamps: false})
};
