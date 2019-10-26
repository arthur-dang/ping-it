const Sequelize = require('sequelize');


const sequelize = require('../sql_config');

module.exports = (sequelize, type) => {
    return sequelize.define('settings_warning', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        apache: {
          type: type.INTEGER,
          allowNull: false,
            defaultValue: '1000'
        },
        docker: {
          type: type.JSON,
          allowNull: false,
            defaultValue: {"cpu": "100", "mem": "100"}
        },
        mongodb: {
          type: type.FLOAT,
          allowNull: false,
            defaultValue: '1000'
        }
    },
  {timestamps: false})
}
