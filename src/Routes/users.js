var express = require('express');
var router = express.Router();
const passport = require('passport');
const UserManager = require('../Controllers/UserManager');
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

//Middleware que verifica que solo los usuarios registrados podran ingresar a esta seccion
router.use(AuthMiddleware.isAuthentication);

// router.get('/:username', function(req, res, next) {
//   res.send('Ruta: /users');
// });

router.get('/notifications', UserManager.createNewUser);

router.post('/register', UserManager.createNewUser);


//Rutas para obtener información JSON
//Todos los usuarios
router.get('/api/users', UserManager.getUsers);

// Un usuario especifico
router.get('/api/:username', UserManager.getUser);




module.exports = router;
