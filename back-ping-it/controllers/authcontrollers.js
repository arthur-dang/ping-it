const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = require('../sql_config.js');

const database = require('../database_config.js');

var User = database.user;
var IP_Machine = database.ip_machine;

var exports = module.exports = {}


exports.logout = function(req, res) {

    req.session.destroy(function(err) {

        res.status(200).send({ message : "logout"});

    });

}


exports.IsAuthenticated = function(req,res,next){
  if(req.isAuthenticated()) {
    next();
  } else {
    next(new Error(401));
  }
}


exports.IsAuthenticatedByIP = function(req,res,next){
  if(req.isAuthenticated()) {
    IP_Machine.findOne({
      attributes: ['userId'],
      where: {
        IPmachine: req.body.IPmachine
      }
    }).then((result) => {
      if(req.session.passport.user === result.userId){
        next();
      }else{
        next(new Error(401));
      }
  });
  } else {
    next(new Error(401));
  }
}
