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

function getPublicaciones(req,res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({user_follower: req.user.sub}).populate('user_following').exec((err,follows)=>{
        if(err){
            res.status(500);
            return res.send({message:"error al devolver el seguimiento"});
        }

        var follow_clean = [];

        follows.forEach((follow)=>{
            follow_clean.push(follow.user_following);
        });

        Publicacion.find({user:{"$in": follows_clean}}).sort('-created_at').populate('user_Id').paginate(page,itemsPerPage,(err,publications,total)=>{
            if(err){
                res.status(500);
                return res.send({message:"error al devolver publicaciones"});
            }
            if(!publications){
                res.status(404);
                return res.send({message:"no hay publicaciones"});
            }
            res.status(200);
            res.send({
                total_items:total,
                pages: Math.ceil(total/itemsPerPage),
                page:page,
                publications
            });
        });

    });
}

function eliminarPublicacion(req,res){
    var idPublicacion = req.params.id;

    Publicacion.find({'user_Id': req.user.sub,'_id':idPublicacion}).remove(err=>{
        if(err){
            res.status(500);
            return res.send({message:"error eliminar la publicacion"});
        }
        if(!publicacionRemoved){
            res.status(404);
            return res.send({message:"no se encontro la publicacion a eliminar"});
        }
        res.status(200);
        res.send({message: 'publicacion borrada correctamente'});
    });
}

module.exports={
    testing,
    savePublicacion,
    getPublicaciones,
    eliminarPublicacion
}