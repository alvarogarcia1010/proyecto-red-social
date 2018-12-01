'use strict'

var express=require('express');
var router =express.Router();
var PostManager=require('../Controllers/PostManager');
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

//Middleware que verifica que solo los usuarios registrados podran ingresar a esta seccion
router.use(AuthMiddleware.isAuthentication);

router.get('/', PostManager.index);
router.post('/', PostManager.createPost);
router.delete('/:id',PostManager.deletePost);

// router.post('/publicacion',md_auth.isAuthentication,publicationController.savePublicacion);
// router.get('/publicaciones/:page',md_auth.isAuthentication,publicationController.getPublicaciones);
// router.delete('/publicacion/:id',md_auth.isAuthentication,publicationController.eliminarPublicacion);

module.exports = router;
