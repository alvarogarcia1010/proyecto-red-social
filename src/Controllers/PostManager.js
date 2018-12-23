'use strict'
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publicacion = require('../Models/publication');
var User = require('../Models/user');
var Follow = require('../Models/follow');

const PostController = {};

//metodo de buscar todas las publicaciones
PostController.index = async function(req,res,next){
    let publicaciones = await Publicacion.find().sort('-created_at').populate('user_Id');
    return res.status(200).json(publicaciones);
}

//metodo de crear la publicacion
PostController.createPost = function (req, res) {
    var params = req.body;

    if (!params.texto) {
        res.status(200);
        return res.json({ message: "debes enviar un texto" });
    }

    var publicacion = new Publicacion();
    publicacion.text = params.texto;
    publicacion.file = 'null';
    publicacion.user_Id = req.user.id;
    //console.log(req.user.id);
    publicacion.created_at = moment().format('LLLL');

    publicacion.save((err, publicacionStored) => {
        if (err) {
            res.status(500);
            return res.json({ message: "error al guardar la publicacion" });
        }
        if (!publicacionStored) {
            res.status(404);
            return res.json({ message: "la publicacion NOOO ha sido guardada :(" });
        }
        res.status(200);
        return res.json({ publicacion: publicacionStored });
    });

}

//metodo de borrar una publicacion
PostController.deletePost = async function(req,res){
    let {id} = req.params;
    await Publicacion.remove({_id:id});
    res.json("la publicacion ha sido eliminada");
}

//metodo de retornar todas las publicaciones
PostController.getPosts = function (req, res) {

    Follow.find({ user_follower: req.user.sub }).populate('user_following').exec((err, follows) => {
        if (err) {
            res.status(500);
            return res.json({ message: "error al devolver el seguimiento" });
        }

        var follow_clean = [];

        follows.forEach((follow) => {
            follow_clean.push(follow.user_following);
        });

        let publicaciones =Publicacion.find({ user: { "$in": follows_clean } }).sort('-created_at');
        res.status(200);
        return res.json(publicaciones);


    });
}

PostController.getPostById = function (req, res) {
    var idPublicacion = req.params.id;

    var publicacion = Publicacion.find({ '_id': idPublicacion });
    res.json({ publicacion });
}

PostController.getPostsByUser = function (req, res) {
    var idPersona = req.params.idPersona;

    var publicaciones = Publicacion.find({ 'user_Id': idPersona });
    res.json({ publicaciones });
}


module.exports = PostController;
