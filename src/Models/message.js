'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
    user: String,
    text: String,
    file: String,
    created_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', MessageSchema);