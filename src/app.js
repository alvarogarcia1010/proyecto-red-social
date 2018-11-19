var express = require('express');
var path = require('path');
var nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
var engine = require('ejs-mate');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var fileUpload = require('express-fileupload');
var {mongodb}=require('./Configs/keys');
var {sessionSecret}=require('./Configs/keys');

//Importing Routes
var indexRouter = require('./Routes/index');

var app = express();

//Connecting to DB
require('./Configs/database');

//Logica Authentication
require('./Authentication/LocalAuth');
require('./Authentication/FacebookAuth');
require('./Authentication/GoogleAuth');

//Setting
app.set('views', path.join(__dirname, '/Views'));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('view cache', true);

//Middlewares
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { _expires: new Date(Date.now() + 10800000)},
  store: new MongoStore({
    url: mongodb.URI,
    autoReconnect: true
  })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) =>{
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.loginMessage = req.flash('loginMessage');
  app.locals.errorMessage = req.flash('error_msg');
  app.locals.user = req.user;
  next();
});


//Routes
app.use('/', indexRouter.init);
app.use('/home', indexRouter.home);
app.use('/', indexRouter.user);
app.use('/messages', indexRouter.messages);
app.use('/file', indexRouter.file);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
