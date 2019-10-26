var bcrypt = require('bcryptjs');
var crypto = require('crypto');



const Sequelize = require('sequelize');


const sequelize = require('../sql_config');

  module.exports = (sequelize, type) => {
      var User = sequelize.define('user', {
          id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          email: {
            type: type.STRING,
            unique : true
          },
          typeOfAccount: {
            type: type.STRING,
          },
          token: {
            type: type.STRING,
            unique: true
          },
          password: {
            type: type.STRING,
          }
        },
      {timestamps: false}
    );


      User.validPassword = function(candidatePassword,password, done) {
        bcrypt.compare(candidatePassword,password, function (err,isMatch) {
          if (err) console.log(err)
          if(isMatch){
            return done(null,isMatch)
          } else {
            return done(null,false)
          }
        });
      }

    return User;
  }
