var express = require('express');
var router = express.Router();
const FileManager = require('../Controllers/FileManager');
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

//Middleware que verifica que solo los usuarios registrados podran ingresar a esta seccion
router.use(AuthMiddleware.isAuthentication);

router.post('/upload-image/:id?', FileManager.uploadAvatarUser);

module.exports = router;
