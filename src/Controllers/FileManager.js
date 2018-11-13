'use strict'
const FileManager = {};

/*
* Subir archivo de imagen
* @params
* @return JSON
*/
FileManager.uploadImage = function (req, res, next) {
  let sampleFile;
  let uploadPath;

  if (Object.keys(req.files).length == 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  sampleFile = req.files.file;
  console.log(__dirname);
  uploadPath = '/home/alvaro/Documents/ayuda-un-peludo/src/public/images/avatarUser/' + sampleFile.name;

  sampleFile.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send('File uploaded to ' + uploadPath);
  });

  // var file = req.files;
  // console.log(file);
  // file.mv('./images/avatarUser/${file.name}',err => {
  //     if(err) return res.status(500).json({ message : err })
  //
  //     return res.status(200).json({ message : 'File upload' })
  // })
};

module.exports = FileManager;
