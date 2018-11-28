'use strict'

var express=require('express');
var publicationController=require('../Controllers/Publicacion');
var api=express.Router();
var md_auth=require('../Middlewares/AuthMiddleware');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./Uploads/Publications'});

api.get('/testing-pub',md_auth.isAuthentication,publicationController.testing);

module.exports = api;