const mongoose = require('mongoose');
const {mongodb} = require('./keys');

var user = process.env.USERDB || mongodb.user;
var password = process.env.PASSDB  || mongodb.password;

var crendentials = user+":"+password+"@";

var server = process.env.SERVER || mongodb.server;
var db = process.env.DATABASE || mongodb.db;

var serverMongoDb = `mongodb://${crendentials}${server}/${db}`

mongoose.Promise = global.Promise;

mongoose.connect(serverMongoDb, {
  useNewUrlParser: true,
  useCreateIndex: true
})
.then(() => console.log('Conecction Success'))
.catch(err => console.error('No Connected \n' + err));
