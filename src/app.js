var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
// var mongoose = require('mongoose');
var ejs = require('ejs')


//Importing Routes
var indexRouter = require('./Routes/index');

var app = express();

//Connecting to DB
require('./Configs/database');

//Setting
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/Views'));
app.set('view engine', 'ejs');
app.set('view cache', true);

//Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
app.use('/', indexRouter.init);
app.use('/users', indexRouter.user);

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
