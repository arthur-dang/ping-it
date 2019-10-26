const Sequelize = require('sequelize');


const sequelize = require('../sql_config');

  module.exports = (sequelize, type) => {
      return sequelize.define('metrique', {
          id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          IPmachine: type.STRING,
          date: type.DATEONLY,
          heure: type.TIME,
          metrique: type.JSON
      },
    {timestamps: false})
  }
