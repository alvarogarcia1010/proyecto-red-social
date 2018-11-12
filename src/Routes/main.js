const express = require('express');
const router = express.Router();
const passport = require('passport');
var nodemailer = require('nodemailer');
const UserManager = require('../Controllers/UserManager');
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

router.get('/', UserManager.init);

router.get('/login', UserManager.login);

//Temporal
router.get('/signup', UserManager.signUp);

router.post('/signup', UserManager.register);

router.post('/login', UserManager.signIn);

router.get('/logout', UserManager.logOut);

router.get('/contact', (req, res) => {
    res.render('contact')
});

router.post('/send', (req, res) => {

    let transporter = nodemailer.createTransport({
        service: "",
        auth: {
            user: "", // generated ethereal user
            pass: "" // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Daniel Alcoleas" <danielalcoleas@live.com>', // sender address
        to: 'balcoleas1@gmail.com', // list of receivers
        subject: 'Probando', // Subject line
        text: "Hello World",  // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact');

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});

//Middleware que verifica que solo los usuarios registrados podran ingresar a esta seccion
router.use(AuthMiddleware.isAuthentication);

router.get('/home', UserManager.home);

module.exports = router;
