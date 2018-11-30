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
PostController.findPostsAll = async function(req,res,next){
    let posts = await Publicacion.find();
    return res.status(200).json(posts);
}

//metodo de crear la publicacion
PostController.createPost = function (req, res) {
    var params = req.body;

    if (!params.text) {
        res.status(200);
        return res.json({ message: "debes enviar un texto" });
    }

    var publicacion = new Publicacion();
    publicacion.text = params.text;
    publicacion.file = 'null';
    publicacion.user_Id = req.user.id;
    publicacion.created_at = moment().unix();

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

PostController.deletePost = function (req, res) {
    var idPublicacion = req.params.id;

    Publicacion.find({ 'user_Id': req.user.sub, '_id': idPublicacion }).remove(err => {
        if (err) {
            res.status(500);
            return res.json({ message: "error eliminar la publicacion" });
        }
        if (!publicacionRemoved) {
            res.status(404);
            return res.json({ message: "no se encontro la publicacion a eliminar" });
        }
        res.status(200);
        res.json({ message: 'publicacion borrada correctamente' });
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
