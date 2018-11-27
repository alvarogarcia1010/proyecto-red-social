'use strict'
var User = require('../Models/user');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
const {email} = require('../Configs/keys');
const mongoosePaginate = require('mongoose-pagination');
const passport = require('passport');
const AuthController = {};

AuthController.init = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.redirect('/login')
  }
};

AuthController.login = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.render('login');
  }

};

AuthController.signUp = function (req, res, next) {
  res.render('signup');
};

AuthController.register = passport.authenticate('local-register', {
  successRedirect: '/home',
  failureRedirect: '/login', //Temporalmente
  passReqToCallback: true
});

AuthController.signIn = passport.authenticate('local-login', {
  successRedirect: '/home',
  failureRedirect: '/login',
  passReqToCallback: true
});

AuthController.facebookLogin = passport.authenticate('FacebookLogin',{
  scope: ['email']
});

AuthController.facebookLoginCallback = passport.authenticate('FacebookLogin', {
  failureRedirect: '/login',
  successRedirect: '/home'
});

AuthController.googleLogin = passport.authenticate('GoogleLogin',{
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
});

AuthController.googleLoginCallback = passport.authenticate('GoogleLogin', {
  failureRedirect: '/login',
  successRedirect: '/home'
});

AuthController.logOut = (req, res, next) => {
  req.logout();
  res.redirect('/')
};

AuthController.forgot = (req, res) =>{
  res.render('forgot');
};

AuthController.home = (req, res, next) => {
  res.render('home');
};

AuthController.dashboard = (req, res, next) => {
  if(req.user.role == 'ROLE_ADMIN')
  {
    res.render('dashboard');
  }
  else
  {
    res.redirect('home')
  }
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
  await User.find({
    username: username.toLowerCase()
  }, (err, user) => {
    if (err) return res.status(500).json({
      success: false,
      message: "Error en la petición"
    });

    if (user && user.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Usuario Encontrado",
        user
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
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
  if (req.params.page) {
    page = req.params.page;
  }

  await User.find().sort('_id').paginate(page, itemsPerPage, (error, users, total) => {
    if (error) return res.status(500).json({
      success: false,
      message: "Error en la petición"
    });

    if (users && users.length > 0) {
      return res.status(200).json({
        success: true,
        total,
        users,
        pages: Math.ceil(total / itemsPerPage)
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No hay usuarios disponibles"
      });
    }
  })

};

/*
* Actualizar información de usuario logeado
* @params req.body
* @return JSON
*/
AuthController.updateUser = async (req, res, next) => {
  var userId = req.params.id;
  var updatedUser = req.body;

  delete updatedUser.password;

  if(userId != req.user._id)
  {
    return res.status(500).json({message:'Permiso para actualizar usuario denegado', success: false});
  }

  await User.findByIdAndUpdate(userId, updatedUser, {new: true}, (error, user) => {
    if (error) return res.status(500).json({success: false, message: "Error en la petición"});

    if (user && user.length > 0)
    {
      return res.status(200).json({success: true, message: "Usuario actualizado", user});
    }
    else
    {
      return res.status(404).json({success: false, message: "Usuario no actualizado"});
    }
  });
};


AuthController.recoverPassword = function(req, res, next){
    //Buscame el correo con await  findAndUpdate
    //if error Retorname status con error
    //if found
      //create el token (mira si requiere el await)
      //guardar al usuario
        var email = req.params.email;
        crypto.randomBytes(20, function(err,buf){
        var token = buf.toString('hex');
      });
    async (token)=>{
      await User.findByIdAndUpdate({_id: id }, function(err,user){
        if(!user){
          console.log("No existe esa cuenta asociada");
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        user.save((err) => {
          done(err, token, user);
        });
      });
    };
    (token, user) =>{
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
          user: email.email, 
          pass: email.password 
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      let mailOptions = {
        from: '"Ayuda un Peludo" <ayudaunpeludoprueba@gmail.com>',
        to: user.email,
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      });
    };
    async (err)=>{
      if(err) return next(err);
      res.redirect('/forgot');
    };
};
/*
* Enviar correo de bienvenida al registrarse.
* @params UserModel
* @return JSON
*/
AuthController.sendMail = (user) => {
  const welcome = `
    <h2>¡Hola, bienvenid@ ${user.name} ${user.surname}! </h2>
    <p>¡Gracias por registrarte!</p>
    <p>Su nombre de usuario es <b>${user.username}</b>.</p>
    <p>¡Esperamos encuentres tu peludo ideal!</p>
  `;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email.email, 
      pass: email.password 
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Ayuda un Peludo" <ayudaunpeludoprueba@gmail.com>', // sender address
    to: user.email , // list of receivers
    subject: 'Bienvenid@!', // Subject line
    text: "Hello World", // plain text body
    html: welcome // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);

  });
};

/*
 * Registra un nuevo usuario
 * @params Datos del usuario a registrar (nombre, apellidos, username, correo, contraseña)
 * @return JSON
 */
AuthController.createNewUser = function (req, res, next) {
  var params = req.body;
  var newUser = new User();

  if (params.name && params.surname && params.email && params.password && params.username) {
    newUser.name = params.name;
    newUser.surname = params.surname;
    newUser.username = params.username;
    newUser.email = params.email;
    newUser.role = 'ROLE_USER';
    newUser.urlImage = null;

    //Buscando si hay un usuario registrado con el mismo email o username
    User.find({
      $or: [{
          email: newUser.email.toLowerCase()
        },
        {
          username: newUser.username.toLowerCase()
        }
      ]
    }).exec((error, user) => {
      if (error) return res.status(500).send({
        message: 'Error al guardar nuevo usuario',
        success: false
      });

      if (user && user.length > 0) {
        return res.status(200).send({
          message: 'Correo electronico o username ya ha sido registrado',
          success: false
        });
      } else {
        bcrypt.hash(params.password, null, null, async function (err, hash) {
          //Si produce un error retornamos el error
          if (err) {
            console.log(err);
            next(err);
          }
          //Almacenamos la password encriptada
          newUser.password = hash;

          await newUser.save((error, user) => {
            if (error) return res.status(500).send({
              message: 'Error al guardar nuevo usuario',
              success: false
            });

            if (user) {
              res.status(200).send({
                message: 'Usuario registrado con exito',
                success: true,
                user
              });
            } else {
              res.status(404).send({
                message: 'Usuario no registrado'
              });
            }
          });
        });
      }
    });
  } else {
    res.status(200).send({
      message: 'Campos obligatorios no completados',
      success: false
    })
  }
}

module.exports = AuthController;
