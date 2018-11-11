'use strict'
var User = require('../Models/user');
var bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const AuthController = {};

/*
* Registra un nuevo usuario
* @params Datos del usuario a registrar (nombre, apellidos, username, correo, contraseña)
* @return JSON
*/
AuthController.createNewUser = function(req, res, next)
{
  var params = req.body;
  var newUser = new User();

  if(params.name && params.surname && params.email && params.password && params.username)
  {
    newUser.name = params.name;
    newUser.surname = params.surname;
    newUser.username = params.username;
    newUser.email = params.email;
    newUser.role = 'ROLE_USER';
    newUser.urlImage = null;

    //Buscando si hay un usuario registrado con el mismo email o username
    User.find({ $or: [
                          {email: newUser.email.toLowerCase()},
                          {username: newUser.username.toLowerCase()}
    ]}).exec((error, user)=>{
      if(error) return res.status(500).send({message: 'Error al guardar nuevo usuario', success: false});

      if(user && user.length > 0)
      {
        return res.status(200).send({message: 'Correo electronico o username ya ha sido registrado', success:false});
      }
      else
      {
        bcrypt.hash(params.password, null, null, async function (err, hash)
        {
          //Si produce un error retornamos el error
          if (err)
          {
              console.log(err);
              next(err);
          }
          //Almacenamos la password encriptada
          newUser.password = hash;

          await newUser.save((error, user) =>{
            if(error) return res.status(500).send({message: 'Error al guardar nuevo usuario', success: false});

            if(user)
            {
              res.status(200).send({message: 'Usuario registrado con exito', success: true, user});
            }
            else
            {
              res.status(404).send({message: 'Usuario no registrado'});
            }
          });
        });
      }
    });
  }
  else
  {
      res.status(200).send({message: 'Campos obligatorios no completados', success: false})
  }
}

AuthController.init = function (req, res, next){
  if (req.isAuthenticated())
  {
    res.redirect('/home');
  }
  else
  {
    res.redirect('/login')
  }
};

AuthController.login = function (req, res, next){
  res.render('login');
};

AuthController.signUp = function (req, res, next){
  res.render('signup');
};

AuthController.register = passport.authenticate('local-register',{
  successRedirect: '/home',
  failureRedirect: '/signup', //Temporalmente
  passReqToCallback: true
});

AuthController.signIn = passport.authenticate('local-login',{
  successRedirect: '/home',
  failureRedirect: '/login',
  passReqToCallback: true
});

AuthController.logOut = (req, res, next) => {
  req.logout();
  res.redirect('/')
};

AuthController.home = (req, res,next) =>{
    res.render('home');
};

module.exports = AuthController;
