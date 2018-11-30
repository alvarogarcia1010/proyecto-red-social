'use strict'
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String, //
    surname: String, //
    provider: String,
    provider_id: {type: String, unique: true},
    email: {type: String, require: true, unique: true}, //
    username: {type: String, require: true, unique: true}, //
    password: String, //
    urlImage: String, //
    role: String,
    fecha_nacimiento: String, //
    pais: String, //
    sobre_mi: String, //kjnh
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    created_at: {type: Date, default: Date.now},
});

UserSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.authenticate = function (password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
