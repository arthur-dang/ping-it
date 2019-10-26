const Sequelize = require('sequelize');

const sequelize = require('../sql_config');

  module.exports = (sequelize, type) => {
      return sequelize.define('IP_machine', {
          id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          IPmachine: {
            type: type.STRING,
            unique: true,
          },
          nom_machine: type.STRING,
          email_warning: type.STRING,

      },
    {timestamps: false})
  }
