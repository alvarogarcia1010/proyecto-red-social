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

function savePublicacion(req,res){
    var params = req.body;

    if(!params.text){
        res.status(200);
        return res.send({message:"debes enviar un texto"});
    }

    var publicacion = new Publicacion();
    publicacion.text = params.text;
    publicacion.file = 'null';
    publicacion.user_Id = req.user.sub;
    publicacion.created_at = moment().unix();

    publicacion.save((err,publicacionStored)=>{
        if(err){
            res.status(500);
            return res.send({message:"error al guardar la publicacion"});
        }
        if(!publicacionStored){
            res.status(404);
            return res.send({message:"la publicacion NOOO ha sido guardada :("});
        }
        res.status(200);
        return res.send({publicacion: publicacionStored});
    });

}

module.exports={
    testing,
    savePublicacion
}