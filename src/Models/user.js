'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    username: String,
    password: String,
    urlImage: String,
    role: String,
    created_at: {type: Date, default: Date.now},
});

module.exports = mongoose.model('User', UserSchema);
