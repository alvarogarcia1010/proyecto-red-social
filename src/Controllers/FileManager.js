'use strict'
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var User = require('../Models/user');
const FileManager = {};

moment().format();

/*
* Subir archivo de imagen
* @params el name debe llamarse file
* @return JSON
*/
FileManager.uploadAvatarUser = async function (req, res, next) {
  var userId = req.user._id;

  if(req.params.id){
    userId =req.params.id;
  }

  if(userId != req.user._id)
  {
    return res.status(500).json({message:'Permiso para actualizar usuario denegado', success: false});
  }

  if (req.files == undefined)
  {
      return res.status(400).json({message:'No files were uploaded.', success: false});
  }
  else
  {
    var sampleFile = req.files.file;
    var extName = path.extname(sampleFile.name);
    var uploadPath = __dirname;
    uploadPath = uploadPath.replace("Controllers", "") + "public/images/avatarUser/" + req.user.username + "-"+ moment() +extName;
    var uploadPathSave = "images/avatarUser/" + req.user.username + "-"+ moment() +extName
    if(extName == ".png" || extName == ".jpg" || extName == ".jpeg" )
    {
      //Hacer validacion que el archivo no exista
      sampleFile.mv(uploadPath, async function(err) {
        if (err) {
            res.status(400).json({message:'Extensión de archivo no valida.', success: false});
        }

        await User.findOneAndUpdate({_id:userId}, {urlImage: uploadPathSave}, {new:true}, (error, user) => {
          if (error) return res.status(500).json({success: false, message: "Error en la petición"});

          if (user)
          {
            return res.status(200).json({ message : 'File upload', success: true })
          }
          else
          {
            return res.status(404).json({success: false, message: "Usuario no actualizado"});
          }
        });
      });
    }
    else
    {
      return res.status(400).json({message:'Extensión de archivo no valida.', success: false});
    }
  }
};

FileManager.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if(err) return res.status(400).json({message:'Error al borrar archivo.', success: false});
  });
};

module.exports = FileManager;
