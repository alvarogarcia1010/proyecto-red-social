const express = require('express');
const router = express.Router();
const passport = require('passport');
var nodemailer = require('nodemailer');
const UserManager = require('../Controllers/UserManager');
const prueba = require('../Repositories/UserRepository');
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

router.get('/', UserManager.init);

router.get('/login', UserManager.login);

router.get('/prueba', async (req, res, next)=>{
  var users = await prueba.getAll();
  if(users['users']){
    res.status(200).json(users['users']);
  }
});

router.get('/prueba/:id', async (req, res, next)=>{
  var user = await prueba.byId(req.params.id);
  if(user['user']){
    res.status(200).json(user);
  }else{
    res.status(404).json("not found");
  }

});



//Temporal
router.get('/reset/:token', UserManager.reset);

router.post('/reset/:token', UserManager.resetPass);

router.get('/signup', UserManager.signUp);

router.post('/signup', UserManager.register);

router.post('/login', UserManager.signIn);

router.post('/forgot', UserManager.recoverPassword);

router.get('/facebook-login', UserManager.facebookLogin);

router.get('/forgot', UserManager.forgot);

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
