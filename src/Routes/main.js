const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserManager = require('../Controllers/UserManager');
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

router.get('/', UserManager.init);

router.get('/login', UserManager.login);

//Temporal
router.get('/signup', UserManager.signUp);

router.post('/signup', UserManager.register);

router.post('/login', UserManager.signIn);

router.get('/logout', UserManager.logOut);

//Middleware que verifica que solo los usuarios registrados podran ingresar a esta seccion
router.use(AuthMiddleware.isAuthentication);

router.get('/home', UserManager.home);

module.exports = router;
