const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../Models/user');
const UserManager = require('../Controllers/UserManager');


passport.serializeUser((user, done) =>{
  done(null, user._id);
});

passport.deserializeUser(async (id, done) =>{
  const user = await User.findById(id);
  done(null, user);
});

passport.use('local-register', new LocalStrategy({
  usernameField: 'username',
  emailField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
    var params = req.body;
    console.log(params);
    var newUser = new User();

    if(params.name && params.surname && params.email && params.password && params.username)
    {
      newUser.name = params.name;
      newUser.surname = params.surname;
      newUser.username = params.username;
      newUser.email = params.email;
      newUser.password = newUser.encryptPassword(params.password);
      newUser.role = 'ROLE_USER';
      newUser.urlImage = 'images/avatarUser/defaultAvatarUser.jpg';
      newUser.provider_id = Math.random() * Date.now();
      newUser.provider = 'AYUDA_UN_PELUDO';
      newUser.fecha_nacimiento = '';
      newUser.sobre_mi = '';
      newUser.pais = '';


      var user =  await User.find({ $or: [
          {email: newUser.email.toLowerCase()},
          {username: newUser.username.toLowerCase()}
      ]});

      if(user && user.length > 0)
      {
        return done(null, false, req.flash('signupMessage', 'El correo o nombre de usuario ya esta en uso'));
      }
      else
      {
        await newUser.save((error, user) =>{
          if (error) console.log(error);
          if(user) console.log(user);
        });
        UserManager.sendMail(newUser);
        // req.session.cookie.expires = new Date(Date.now() + )
        done(null, newUser);

      }
    }
    else
    {
      return done(null, false, req.flash('signupMessage', 'Campos requeridos no completados'));
    }
}));

passport.use('local-login', new LocalStrategy({
  usernameField: 'username',
  emailField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  var user = await User.findOne({username: username});
  if(username =='' || password == '')
  {
    return done(null, false,req.flash('loginMessage', 'Complete todos los campos'));
  }
  if(!user)
  {
    return done(null, false,req.flash('loginMessage', 'Usuario no encontrado'));
  }
  if(!user.authenticate(password))
  {
    return done(null, false,req.flash('loginMessage', 'Contraseña incorrecta'));
  }
  done(null, user);
}));
