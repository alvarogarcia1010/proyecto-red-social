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

router.get('/notificaciones', UserManager.notification);

router.get('/configuraciones',UserManager.configuration);

router.post('/register', UserManager.createNewUser);


//Rutas para obtener información JSON
//Todos los usuarios
router.get('/api/users', UserManager.getUsers);

//Actualiza la informacion de usuario
router.put('/api/update-user/:id', UserManager.updateUser);

// Un usuario especifico
router.get('/api/:username', UserManager.getUser);

module.exports = router;
