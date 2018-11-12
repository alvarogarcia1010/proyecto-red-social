'use strict'
var User = require('../Models/user');
var bcrypt = require('bcrypt-nodejs');
const mongoosePaginate = require('mongoose-pagination');
const passport = require('passport');
const AuthController = {};

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

/*
* Obtener usuario
* @params username
* @return JSON
*/
AuthController.getUser = async (req, res, next) => {
  //Agarro el username a buscar
  var username = req.params.username;
  //Lo busco en mi base de datos
  await User.find({username: username.toLowerCase()}, (err, user) => {
    if (err) return res.status(500).json({success: false, message: "Error en la petición"});

    if(user && user.length > 0)
    {
      return res.status(200).json({success: true, message: "Usuario Encontrado", user});
    }
    else
    {
      return res.status(404).json({success: false, message: "Usuario no encontrado"});
    }
  });
};

/*
* Obtener todos los usuarios paginados
* @params paginacion
* @return JSON
*/
AuthController.getUsers = async (req, res, next) => {
  var userLoggerId = req.user.id
  var page = 1;
  var itemsPerPage = 20;
  if(req.params.page)
  {
      page = req.params.page;
  }

  await User.find().sort('_id').paginate(page, itemsPerPage, (error, users, total) => {
    if (error) return res.status(500).json({success: false, message: "Error en la petición"});

    if(users && users.length > 0)
    {
      return res.status(200).json({success: true, total, users, pages: Math.ceil(total/itemsPerPage)});
    }
    else
    {
      return res.status(404).json({success: false, message: "No hay usuarios disponibles"});
    }
  })

};

/*
* Actualizar información de usuario
* @params paginacion
* @return JSON
*/
AuthController.updateUser = async (req, res, next) => {

  await User.findByIdAndUpdate
};


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

module.exports = AuthController;
