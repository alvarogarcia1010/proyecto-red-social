'use strict'
// const path = require('path');
// const fs = require('fs');
var User = require('../Models/user');
var Follow = require('../Models/follow');
const mongoosePaginate = require('mongoose-pagination');

const FollowController = {};

/*
 * Seguir a un usuario en especifio
 * @params
 * @body following
 * @return JSON
 */
FollowController.followUser = async (req, res, next) => {
  var params = req.params;

  var newFollow = new Follow();
  newFollow.user_follower = req.user._id;
  newFollow.user_following = params.following;

  await newFollow.save((error, followStored) => {
    if (error) return res.status(500).json({success: false, message: "Error en la petición"});

    if (followStored)
    {
      return res.status(200).json({success: true, message: "Usuario seguido con exito", followStored});
    }
    else
    {
      return res.status(404).json({success: false, message: "Error al seguir usuario"});
    }
  });
};

FollowController.unfollowUser = (req, res, next) => {
  // var followId = req.params.id;
  // var userId = req.user._id;

  Follow.find({user_follower:req.user._id, user_following:req.params.id}).remove(err => {
    if (error) return res.status(500).json({success: false, message: "Error en la petición"});

    return res.status(200).json({success: true, message: "Se dejo de seguir al usuario"});
  });
};

/*
* Obtener los usuarios que sigo
* @params req.params
* @return JSON
*/
FollowController.getFollowingUsers = (req, res, next) => {
  var userId = req.user._id;
  var page = 1;
  var itemsPerPage = 100;
  if(req.params.id){
    userId = req.params.id;
  }
  if(req.params.page){
    page = req.params.page;
  }

  Follow.find({user_follower: userId}).populate({path: 'user_following', select: '_id name surname username email urlImage fecha_nacimiento sobre_mi pais' }).paginate(page, itemsPerPage, (error, follows, total) =>{
      if (error) return res.status(500).json({success: false, message: "Error en la petición"});

      if (follows && follows.length > 0)
      {
        return res.status(200).json({success: true, message: "Usuario seguido con exito", follows, total, pages: Math.ceil(total/itemsPerPage)});
      }
      else
      {
        return res.status(404).json({success: false, message: "No sigues a ningun usuario aun..."});
      }
  });
};

/*
* Obtener los usuarios que me siguen
* @params req.params
* @return JSON
*/
FollowController.getFollowedUsers = (req, res, next) => {
  var userId = req.user._id;
  var page = 1;
  var itemsPerPage = 4;
  if(req.params.id){
    userId = req.params.id;
  }
  if(req.params.page){
    page = req.params.page;
  }

  Follow.find({user_following: userId}).populate({path: 'user_follower', select: '_id name surname username email urlImage fecha_nacimiento sobre_mi pais' }).paginate(page, itemsPerPage, (error, follows, total) =>{
      if (error) return res.status(500).json({success: false, message: "Error en la petición"});

      if (follows && follows.length > 0)
      {
        return res.status(200).json({success: true, message: "Usuario seguido con exito", followStored, total, pages: Math.ceil(total/itemsPerPage)});
      }
      else
      {
        return res.status(404).json({success: false, message: "No te sigue ningun usuario aun..."});
      }
  });
};



module.exports = FollowController;
