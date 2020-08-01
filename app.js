require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const Recaptcha = require('recaptcha-v2').Recaptcha;

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

const whitelist = [process.env.DOMAIN_1, process.env.DOMAIN_2]
const corsOptions = {
  origin: function (origin, cb) {
    if (whitelist.indexOf(origin) !== -1) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  }
};

//Captcha function
const CaptchaVerify = (req, res, next) => {
    let data = {
        remoteip:  req.connection.remoteAddress,
        response:  req.param('googlecaptcha'),
        secret: SECRET_KEY
    };

    let recapctha = new Recaptcha(PUBLIC_KEY, SECRET_KEY, data);
    recapctha.verify((success, err) => {
        if (success) {
            next();
        }
        else {
            console.log(err);
            res.status(500).json({message: "Captcha is not valid"})
        }
    });
    
};


//App.use
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.post('/', CaptchaVerify, (req,res,next) => {
    let { username } = req.body
    res.status(200).json({message: `Hi ${username}, good to see u`})
});



app.listen(PORT, () => console.log(`Server started on ${PORT}`))
