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
  var params = req.body;

  var newFollow = new Follow();
  newFollow.user_follower = req.user._id;
  newFollow.user_following = params.following;

  await newFollow.save((error, followStored) => {
    if (error) return res.status(500).json({success: false, message: "Error en la petición"});

    if (followStored && followStored.length > 0)
    {
      return res.status(200).json({success: true, message: "Usuario seguido con exito", followStored});
    }
    else
    {
      return res.status(404).json({success: false, message: "Error al seguir usuario"});
    }
  });
};

module.exports = FollowController;
