var express = require('express');

var router = express.Router();

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('104679163324-93ufgs40atd6p2bruhh01gm8h2tf97e6.apps.googleusercontent.com');
const request = require('request-promise');

var crypto = require('crypto');



var authController = require('../controllers/authcontrollers.js');

const Sequelize = require('sequelize');

const sequelize = require('../sql_config.js');

var passport = require('passport');
const database = require('../database_config.js');
var User = database.user;

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      //console.log(req.session);
      res.status(403).send({
    errorMessage: 'a user is already logged in'
  });
}
 else {
        next();
    }
};


async function verify(req,res,next, token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '104679163324-93ufgs40atd6p2bruhh01gm8h2tf97e6.apps.googleusercontent.com',
  });
  var emailGoogle = ticket.payload.email;
  if (ticket.payload.email_verified) {
    User.findOne({
      attributes: ['email','id','typeOfAccount'],
      where: {
        email: emailGoogle
      }
    }).then((result) => {

      var user = result;
   
      //console.log("google "+JSON.stringify(result));
      if (user === null) {
        //console.log("null");
        crypto.randomBytes(10, function(err, buffer) {
        var token = buffer.toString('hex');
          User.create({email: emailGoogle, typeOfAccount:'google', token: token, password: 'passwordgoogle'}).then((result) => {
            //console.log("res :"+result.dataValues.id)
          req.session.passport = { user : result.id} ;
          res.send({flag :true});})
      });
    }
      else if (user.typeOfAccount !== 'google') {
        
        console.log(user.typeOfAccount);
        res.status(403).send({
        errorMessage: 'a user already uses this email',
        flag:false
        });
      }
      else if (user.typeOfAccount === 'google') {
        //console.log("google "+result);
     

        req.session.passport = { user : result.dataValues.id} ;
        res.json(true);
      }
  });
}
}

router.post('/googleAuth', sessionChecker,(req, res,next) => {
        verify(req,res,next,req.body.idtoken).catch(console.error);
      });

router.post('/facebookAuth', sessionChecker,(req, res,next) => {
        const clientId = '485715288572249';
        const clientSecret = 'bd5566e57e85d83b43661a8495372e79';
        const userToken = req.body.userToken;
        const emailFacebook = req.body.email;
        const options = {
          method: 'GET',
          uri: 'https://graph.facebook.com/oauth/access_token?client_id=' + clientId + '&client_secret=' + clientSecret + '&grant_type=client_credentials',
        };
        request(options).then(fbRes => {
          const fb = JSON.parse(fbRes);
          const appToken = fb.access_token;
          const options1 = {
            method: 'GET',
            uri: 'https://graph.facebook.com/debug_token?input_token=' + userToken + '&access_token=' + appToken
          };
          request(options1).then(fbRes1 => {
            const fb1 = JSON.parse(fbRes1);
            const is_valid = fb1.data.is_valid;
            if (is_valid) {
              User.findOne({
                attributes: ['email','id','typeOfAccount'],
                where: {
                  email: emailFacebook
                }
              }).then((result) => {
                var user = result;
                if (user === null) {
                  //console.log("null");
                  crypto.randomBytes(10, function(err, buffer) {
                  var token = buffer.toString('hex');
                    User.create({email: emailFacebook, typeOfAccount:'facebook', token: token, password: 'passwordfacebook'}).then((result) => {
                      req.session.passport = { user : result.id} ;
                      res.send({flag :true});})
                });
              }
              else if (user.typeOfAccount !== 'facebook') {
                //console.log(user.dataValues.typeOfAccount);
                res.status(403).send({
                errorMessage: 'a user already uses this email',
                flag:false
                });
              }
              else if (user.typeOfAccount === 'facebook') {
                //console.log(user.dataValues.typeOfAccount);
                req.session.passport = { user : result.dataValues.id} ;
                res.send({flag :true});
              }
            });
            }
          })
        });
      });

router.post('/register', sessionChecker,passport.authenticate('local-register'), function(req, res, next) {
  res.json();
});



router.post('/login',passport.authenticate('local-login'),function(req, res, next){
  res.json()
});
/*
passport.authenticate('local-login',function(err, user, info){  
   
    console.log(info)
    res.json(info);  
  })(req, res, next);
  */

router.post('/logout', authController.logout);


router.get('/profile', function(req, res, next) {
  //console.log('profile '+ JSON.stringify(req.session))
  User.findOne({
    attributes: ['email','token'],
    where: {
      id: req.session.passport.user
    }
  }).then((result) => {
    //console.log({result})
    res.json(result);
  });
});


router.get('/isLogin', function(req, res, next) {
  console.log(req.session)
  if(req.isAuthenticated()){
    res.send({flag:true})
    console.log(true)
  };
  if(!req.isAuthenticated()) {
    res.send({flag:false})
    console.log(false)
  };

});


router.put('/updateToken', function(req, res, next) {
   crypto.randomBytes(10, function(err, buffer) {
    var newtoken = buffer.toString('hex');
    var email = req.body.email
    User.update(
      {token: newtoken}
      ,
      {where: {email: req.body.email}}
      ).then(res.send({flag:true}));
  });
  
});
module.exports = router;
