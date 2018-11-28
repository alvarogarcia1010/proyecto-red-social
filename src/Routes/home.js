const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserManager = require('../Controllers/UserManager');
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

//Middleware que verifica que solo los usuarios registrados podran ingresar a esta seccion
router.use(AuthMiddleware.isAuthentication);

router.get('/', UserManager.home);
router.get('/profile', (req,res)=>{
    res.render('perfil')
});



module.exports = router;
