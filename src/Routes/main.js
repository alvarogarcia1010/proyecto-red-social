const express = require('express');
const router = express.Router();
const passport = require('passport');
var nodemailer = require('nodemailer');
const UserManager = require('../Controllers/UserManager');
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

router.get('/', UserManager.init);

router.get('/login', UserManager.login);

//Temporal
router.get('/signup', UserManager.signUp);

router.post('/signup', UserManager.register);

router.post('/login', UserManager.signIn);

router.get('/facebook-login', UserManager.facebookLogin);

router.get('/facebook-login/callback', UserManager.facebookLoginCallback);

router.get('/google-login', UserManager.googleLogin);

router.get('/google-login/callback', UserManager.googleLoginCallback);

router.get('/logout', UserManager.logOut);

router.get('/contact', (req, res) => {
    res.render('contact')
});

//Middleware que verifica que solo los usuarios registrados podran ingresar a esta seccion
router.use(AuthMiddleware.isAuthentication);

router.get('/dashboard', UserManager.dashboard);

module.exports = router;
