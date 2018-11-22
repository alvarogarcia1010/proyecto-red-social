const passport = require('passport');
const User = require('../Models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
const {facebook} = require('../Configs/keys');
const UserManager = require('../Controllers/UserManager');

passport.use('FacebookLogin', new FacebookStrategy({
    expires: 3600,
    clientID: facebook.id,
    clientSecret: facebook.secret,
    callbackURL: "/facebook-login/callback",
    profileFields: ['id', 'displayName', 'emails' ,'name','picture.type(large)']
}, function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({
        provider_id: profile.id
    }, async function (err, user) {
        if (err) throw (err);
        if (!err && user != null) {
            console.log('error:' + user);
            return done(null, user);
        }
        var user = new User({
            provider_id: profile.id,
            provider: profile.provider,
            name: profile.name.givenName,
            surname: profile.name.familyName,
            urlImage: profile.photos[0].value,
            username: '@' + (profile.name.givenName + profile.name.familyName).toLowerCase(),
            role: 'ROLE_USER',
            fecha_nacimiento: profile.birthday,
            sobre_mi: '',
            pais: '',
            password: '',
            email: profile.emails[0].value
        });
        await user.save(function (err) {
            if (err) throw err;
            UserManager.sendMail(user);
            console.log('se guardó'+ user);
            done(null, user);
        });
    });
}));