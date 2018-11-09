'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationSchema = Schema({
    participant: {type: Array, "User": []},
    message: {type: Array, "Message": []}
});

module.exports = mongoose.model('Conversation', ConversationSchema);

