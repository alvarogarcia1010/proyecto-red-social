'use strict'

var path=require('path');
var fs=require('fs');
var moment=require('moment');
var mongoosePaginate=require('mongoose-pagination');

var Publicacion=require('../Models/publication');
var User=require('../Models/user');
var Follow=require('../Models/follow');

function testing(req,res){
    res.status(200);
    res.send({message:"enviando este desde el controlador de publicaciones"});
}

module.exports={
    testing
}