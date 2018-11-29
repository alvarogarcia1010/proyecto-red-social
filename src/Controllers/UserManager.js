'use strict'
var User = require('../Models/user');
var UserManagement = require('../Services/UserManagement');
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

AuthController.configuration = (req, res, next) => {
  res.render('config');
};

AuthController.notification = (req, res, next) => {
  UserManagement.getUsers(1,3,function (users){
    res.render('notification', {users});
  });
};

AuthController.messages = (req, res, next) => {
  res.render('messages');
}

AuthController.reset = (req,res) =>{
  console.log(req.params);
  var param = {resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } };
  User.findOne(param, function(err,user){
    if(err){
      return res.redirect('/forgot');
    }
    else{
      console.log("usuario"+user);
      res.render('reset', {user});
      };
    })
  };

AuthController.home = (req, res, next) => {
  var index;
  UserManagement.getUsers(1,4,function (users){
    users.forEach(user => {
      if(req.user.username == user.username)
      {
        index = users.indexOf(user);
        if ( index !== -1 )
        {
          users.splice( index, 1 );
        }
      }
    });
    res.render('home', {users});
  });
};

AuthController.profile = (req, res, next) => {
  var userProfile, index;
  UserManagement.getUsers(1,3,function (users){
    users.forEach(user => {
      if(user.username == req.params.username)
      {
        userProfile = user;
      }
    });

    users.forEach(user => {
      if(req.user.username == user.username)
      {
        index = users.indexOf(user);
        if ( index !== -1 )
        {
          users.splice( index, 1 );
        }
      }
    });


    if(userProfile)
    {
      res.render('perfil', {userProfile, users});
    }
    else{
      res.send("Usuario no encontrado")
    }
  });
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
  var itemsPerPage = 3;
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


AuthController.confMail=function(user,token,req,res){
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
    subject: 'Cambio de contraseña',
    text: 'Usted ha recibido este correo porque ha solicitado cambiar la contraseña de su cuenta.\n\n' +
    'Por favor, dele click al siguiente link, o copielo en su navegador de preferencia para poder continuar con el proceso:\n\n' +
    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
    'Si usted no ha solicitado este cambio, por favor ignore este correo. Su contraseña seguirá siendo la misma.\n'
  };transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return console.log(error);
    }
    res.status(200).json({success:true, message: "El correo se ha enviado con exito."});
  });
}

AuthController.resetPass = async(req,res, next)=>{
  var newUser = new User();
  var pass = newUser.encryptPassword(req.body.password);
  var param = {resetPasswordToken: undefined, resetPasswordExpires: undefined , password: pass };
  var username = req.body.username;

  await User.findOneAndUpdate(username,param,{new: true}, (error, user) => {
    console.log(user);
     if (error) return res.status(500).json({success: false, message: "Error en la petición"});
     if(user){
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
        subject: 'Confirmación de cambio de contraseña',
        text: 'Hola,\n\n' +
        'Este correo es para confirmar que la contraseña de la cuenta asociada a ' + user.email + ' ha sido cambiada.\n'
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        res.redirect('login');
      });
     }
     else{
       return res.status(404).json({success: false, message: "Token Invalido"});
     }
   });
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


AuthController.randomValue = function (len){
  return crypto.randomBytes(len).toString('hex').slice(0,len);
}

AuthController.recoverPassword = async (req, res, next)=>{
    var token = AuthController.randomValue(20);
    var updatedUser = {resetPasswordToken : token, resetPasswordExpires: Date.now() + 3600000};

    await User.findOneAndUpdate({email: req.body.email}, updatedUser ,{new: true}, (error, user) => {
      if (error) return res.status(500).json({success: false, message: "Error en la petición"});

      if (user){
        //CREAR METODO PARA ENVIAR
        AuthController.confMail(user,token,req,res);
        //Metodo hasta aqui, quitar los console log y que solo return true o false
        //if retorno true

        //else
      }
      else
      {
        return res.status(404).json({success: false, message: "Correo no encontrado"});
      }
    });
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
