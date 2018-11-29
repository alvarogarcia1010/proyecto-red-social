'use strict'

var express=require('express');
var publicationController=require('../Controllers/Publicacion');
var api=express.Router();
var md_auth=require('../Middlewares/AuthMiddleware');

//var multipart = require('connect-multiparty');
//var md_upload = multipart({uploadDir:'./Uploads/Publications'});

api.get('/',function(req,res,next){
    res.render('dashboard');
});

//RUTAS QUE VIENEN DESDE EL /post
api.get('/testing-pub',md_auth.isAuthentication,publicationController.testing);
api.post('/publicacion',md_auth.isAuthentication,publicationController.savePublicacion);
api.get('/publicaciones/:page',md_auth.isAuthentication,publicationController.getPublicaciones);

module.exports = api;