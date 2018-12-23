'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = Schema({
    text: String,
    file: String,
    created_at: {type: Date, default: Date.now},
    updated_at: Date,
    deleted_at: Date,
    meEmpeluda: [{type: Schema.Types.ObjectId, ref:'User'}], 
    comentario: [{type: Schema.Types.ObjectId,  ref : 'User'}],
    user_Id: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Publication', PublicationSchema);