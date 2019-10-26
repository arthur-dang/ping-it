var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ip_mailRouter = require('./routes/ip_mail');

var sqlRouter = require('./routes/sql');
var forgot_psw = require('./routes/forgot_psw');
var dashboard = require('./routes/dashboard');
var passport = require('passport');

var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

var database = require('./database_config');
var User = database.user;

require('./config/passport/passport.js')(passport, User);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(cors({origin:'http://localhost:3001',credentials: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    key: 'user_sid',
    secret: 'My Secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      name:'user_cookie',
        expires: 600000
    }
}));

app.use(passport.initialize());
app.use(passport.session());



app.use('/back', indexRouter);
app.use('/back/users', usersRouter);
app.use('/back/mail',ip_mailRouter);
app.use('/back/sql',sqlRouter);
app.use('/back/forgotpsw',forgot_psw);
app.use('/back/dashboard',dashboard);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;
