const passport = require('passport');
const AuthMiddleware = {};

AuthMiddleware.isAuthentication  = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Not Authorized');
  res.redirect('/login');
};

module.exports = AuthMiddleware;
