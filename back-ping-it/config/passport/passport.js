var bcrypt = require('bcryptjs');
var crypto = require('crypto');

var passport = require('passport');

var database = require('../../database_config');
var User = database.user;

  module.exports = function(passport, user) {
  var User = user;
  var LocalStrategy = require('passport-local').Strategy;
  passport.use('local-register', new LocalStrategy(
      {
          usernameField: 'email',
          passwordField: 'password',
          passReqToCallback: true
      },

      function(req, email, password, done) {

        bcrypt.genSalt(10,function(err,salt) {
            crypto.randomBytes(10, function(err, buffer) {
            var token = buffer.toString('hex');
                bcrypt.hash(password,salt,function(err,hash){
                    User.findOne({
                        where: {
                            email: email
                        }
                    }).then(function(user) {
                        if (user){
                            return done(null, false, {
                                message: 'That email is already taken'
                            });
                        } else {
                            User.create({email: email, password: hash, token: token, typeOfAccount: 'pingit'}).then((result) => {
                                return done(null, result, {
                                    message: 'User registered'
                                });
                            })
                        }
                    });
                });
            });
        });
      }
    )
  )

  passport.use('local-login', new LocalStrategy(
      {
          usernameField: 'email',
          passwordField: 'password',
          passReqToCallback: true
      },
      function(req, email, password, done) {
        var isValidPassword = function(password, userpass) {
            return bcrypt.compareSync(password, userpass);
        }
          User.findOne({
              where: {
                  email: email
              }
          }).then(function(user) {
              if (!user) {
                  return done(null, false, {
                      message: 'Email does not exist'
                  });
              }
              if (isValidPassword(password, user.password) === false) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            var userinfo = user.get();
            return done(null, userinfo, {
                message: 'OK'
            });
          }).catch(function(err) {
              console.log("Error:", err);
              return done(null, false, {
                  message: 'Something went wrong with your Signin'
              });
          });
      }
  ));
}


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
        if (user) {
            done(null, user.get());
        } else {
            done(user.errors, null);
        }
    });
});
