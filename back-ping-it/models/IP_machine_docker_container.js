const Sequelize = require('sequelize');

const sequelize = require('../sql_config');

module.exports = (sequelize, type) => {
    return sequelize.define('IP_machine_docker_container', {


    },
  {timestamps: false})
};
