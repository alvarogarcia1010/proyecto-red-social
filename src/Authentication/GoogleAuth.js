const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/user');
const {google} = require('../Configs/keys');
const UserManager = require('../Controllers/UserManager');

passport.use('GoogleLogin', new GoogleStrategy({
    clientID: google.idG,
    clientSecret: google.secretG,
    callbackURL: "/google-login/callback",
}, function (accessToken, refreshToken, profile, done) {
    var photoF = profile._json.image.url;
    var img = photoF.replace("sz=50","sz=100");
    User.findOne({
        provider_id: profile.id
    }, async function (err, user) {
        if (err) throw (err);
        if (!err && user != null) {
            console.log('error:' + user);
            return done(null, user);
        }
        var string1 = profile.displayName;
        var sep = string1.split(" ");
        var name1;
        var surname1;
        if(sep.length == 4){
            name1 = sep[0];
            surname1 = sep[2];
        }
        if(sep.length == 2){
            name1 = sep[0];
            surname1 = sep[1];
        }
        var user = new User({
            provider_id: profile.id,
            provider: profile.provider,
            name: name1,
            surname: surname1,
            urlImage: img,
            username: '@' + name1.toLowerCase() + surname1.toLowerCase(),
            role: 'ROLE_USER',
            fecha_nacimiento: '',
            sobre_mi: '',
            pais: '',
            password: '',
            email: profile.emails[0].value
        });
        await user.save(function (err) {
            if (err) throw err;
            UserManager.sendMail(user);
            console.log(user);
            done(null, user);
        });
    });
}));
