var express = require('express');
var router = express.Router();

var UserManager = require('../Controllers/UserManager');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Ruta: /users');
});

router.post('/register', UserManager.createNewUser);

module.exports = router;
