/* var mongoose = require('mongoose');
var IpDashboardSchema = new mongoose.Schema({
    ip: String,
    dashboard: Array

  })

module.exports = mongoose.model('Ip_Dashboard', IpDashboardSchema); */
// Ip to IP
const Sequelize = require('sequelize');

const sequelize = require('../sql_config');

module.exports = (sequelize, type) => {
    return sequelize.define('IP_dashboard', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        dashboard: type.JSON,
        IPmachineId: {
          type: type.INTEGER,
          references: {
             model: 'IP_machines', // 'persons' refers to table name
             key: 'id', // 'id' refers to column name in persons table
          }
        }
    },
  {timestamps: false})
}
