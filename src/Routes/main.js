const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signup', function(req, res, next){
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup',{
  successRedirect: '/home',
  failureRedirect: '/signup',
  passReqToCallback: true
}));

router.get('/login', function(req, res, next){
  res.render('login');
});

router.post('/login', passport.authenticate('local-login',{
  successRedirect: '/home',
  failureRedirect: '/login',
  passReqToCallback: true
}));

router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/')
});

//Solo usuarios que hayan iniciado sesión
router.use((req, res, next)=>{
  isAuthenticated(req, res, next);
  next();
});

router.get('/home', isAuthenticated, function(req, res, next){
  res.render('home');
});


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Not Authorized');
  res.redirect('/');
}

module.exports = router;
