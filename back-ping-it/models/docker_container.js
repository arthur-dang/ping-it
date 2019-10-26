const Sequelize = require('sequelize');

const sequelize = require('../sql_config');

module.exports = (sequelize, type) => {
    return sequelize.define('docker_container', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        container_id: type.STRING,
        container_name: type.STRING,

    },
  {timestamps: false})
};
