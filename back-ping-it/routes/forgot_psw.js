var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

var nodemailer = require("nodemailer");

var jwt = require('jwt-simple');
const secret = 'anYjpmJQDWmKQwTe6fE8AxeujJRQAsk2qUSuGjTFjcXmyXQBHC5aL5tzQGYZTMV2kf3HMXeKKc6Mne99FHpzQLttMtTRHhjEfx45eckQCLHTXCYnHbDRCB4fkvAA9HDGx2kfPzEC62BZztZpvyDEEvdLAsSKTLRCanaGRYNUfqJC4XuPq7fADd9tjVLwSBr47V9WByUSmSrZ6CAFxvHgJ3pq8TPnTSN4NZMBCKTZcmJpc8h5jsb5MpgSQfUPzMJA';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = require('../sql_config.js');

const database = require('../database_config.js');

var User = database.user;
var TokenForgotPassword = database.token_forgot_password;
var IP_Machine = database.ip_machine;

var pingitChecker = (req, res, next) => {
  if (req.body.hasOwnProperty('email')) {

    User.findOne({
      where: {
        email: req.body.email
      }
    }).then((result) => {
      var compte = result;
      if (!(compte === null)) {
        console.log(compte.typeOfAccount)
        if (compte.typeOfAccount === 'pingit') {
          next();
        }
        else {
          res.send({ flag: false });
        }
      } else {
        res.send({ flag: false });
        //console.log("pas de mail valid")
      }

    });

  } else {
    res.send({ flag: false });
    //console.log("pas de mail")
  }

}

var token_forgot_passwordChecker = (req, res, next) => {
  if (req.body.hasOwnProperty('token')) {
    var t = jwt.decode(req.body.token, secret)

    var date = new Date().getTime();
    if (t.date > date) {
      TokenForgotPassword.findOne({
        where: {
          token_forgot_password: req.body.token
        }
      }).then((result) => {
        var token = result;
        if (token) {
          console.log('token already used');
          res.send({
            flag: false,
            errorMessage: 'token already used',
            time: true
          });
        }
        else {
          TokenForgotPassword.create({ token_forgot_password: req.body.token }).then(() => {
            next();
          });

        }
      })

    } else {
      res.send({
        flag: true,
        time: false


      });
      console.log("time out")
    }

  } else {
    res.send({
      flag: false,
      time: true

    });
    console.log("pas de token")

  }

}


router.post('/', pingitChecker, function (req, res, next) {
  var dd = new Date();
  var d = new Date(dd.setHours(dd.getHours() + 1)).getTime();

  var payload = { email: req.body.email, date: d };
  console.log('playload : ' + payload)

  var token = jwt.encode(payload, secret);
  var proxy ="https://ping-it.cs-campus.fr/"
  //var proxy = "https://localhost:3001/"


  var sujet = 'Recuperation Compte Ping It'

  var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "pingit.mail@gmail.com",
      pass: "1234Ping*"
    }
  });

  var mail = {
    from: "pingit.mail@gmail.com",
    to: req.body.email,
    subject: sujet,
    html: '<p>Cliquer  <a href="'+proxy+'recuperation/t?' + token + '">ici</a> pour réinitialiser votre mot de pass vous avez 1h </p>'
  }
  smtpTransport.sendMail(mail, function (error, response) {
    if (error) {
      console.log("Erreur lors de l'envoie du mail!");
      console.log(error);
    } else {
      console.log("Mail envoyé avec succès!")
    }
    smtpTransport.close();
    res.send({
      flag: true

    });
  });




});

router.post('/reset', token_forgot_passwordChecker, function (req, res, next) {


  var mail = jwt.decode(req.body.token, secret)
  //console.log(mail)
  User.findOne({
    attributes: ['token'],
    where: {
      email: mail.email
    }
  }).then((result) => {
    var user = result;
    // console.log(user)

    bcrypt.genSalt(10, function (err, salt) {

      bcrypt.hash(req.body.password, salt, function (err, hash) {
        User.update({ email: mail.email, typeOfAccount: 'pingit', password: hash, token: user.token }, {
          where: {
            email: mail.email
          }
        }).then((result) => {
          res.send({
            flag: true,
            time: true
          });

        });
      });
    });




  });

});





module.exports = router;
