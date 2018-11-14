var express = require('express');
var router = express.Router();
const FileManager = require('../Controllers/FileManager');

router.post('/upload-image/:id', FileManager.uploadAvatarUser);

module.exports = router;
