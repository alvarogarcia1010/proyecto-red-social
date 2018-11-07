var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swig  = require('swig');
var mongoose = require('mongoose')

//Importing Routes
var indexRouter = require('./Routes/index');
var usersRouter = require('./Routes/users');

var app = express();

//Connecting to DB
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/crud-mongo', {
    useNewUrlParser: true
  })
  .then(() => console.log('La conexión con la base de datos fue exitosa'))
  .catch((err) => console.error(err));

//Setting
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, '/Views'));
app.set('view engine', 'html');

app.set('view cache', true);
swig.setDefaults({ cache: false });

//Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
