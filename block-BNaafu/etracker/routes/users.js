var express = require('express');
var router = express.Router();
var User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { sendMail } = require('../modules/emailsend');
const { randomString } = require('../modules/random');
const { sendResetEmail } = require('../modules/reset');
const RESET_TOKEN_EXPIRATION_TIME = 60 * 60 * 1000;
var multer = require('multer');
var path = require('path');
var uploadPath = path.join(__dirname, '../', 'public/images');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + '-' + file.originalname);
  },
});

var upload = multer({ storage: storage });
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  res.render('register', { error: req.flash('error')[0] });
});

router.post('/register', (req, res, next) => {
  // const { name, email, password, age, country,phone } = req.body;
  const { email } = req.body;
  let uniqueString = uuidv4(); //defined lese ware in script

  const newUser = new User({
    ...req.body,
    uniqueString,
  });

  //save the new user
  newUser
    .save()
    .then(() => {
      sendMail(email, uniqueString); // function for sending email to the given address
      res.redirect('back');
    })
    .catch((error) => {
      // any error that occurred during user creation or email sending
      console.error(error);
      res.redirect('/register'); // Redirect to the registration page
    });
});

router.get('/verify/:uniqueString', (req, res, next) => {
  const { uniqueString } = req.params;
  User.findOne({ uniqueString })
    .then((user) => {
      if (user) {
        user.isValid = true;
        return user.save();
      } else {
        throw new Error('User not found');
      }
    })
    .then(() => {
      res.render('verify');
    })
    .catch((error) => {
      console.error(error);
      res.json('User not found');
    });
});

router.get('/login', (req, res, next) => {
  res.render('login', { error: req.flash('error')[0] });
});

//login handler
router.post('/login', upload.single('image'), (req, res, next) => {
  var { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'Email/password required');
    return res.redirect('/users/login');
  }
  User.findOne({ email })
    .then((user) => {
      console.log(user);
      // if no user
      if (!user) {
        req.flash('error', 'This Email is not Regitered');
        return res.redirect('/users/register');
      } else if (!user.isValid) {
        // user email not verified
        res.json('Please verify your email before logging in');
      } else {
        // for user compare password
        user.verifyPassword(password, (err, result) => {
          if (err) return next(err);
          if (!result) {
            req.flash('error', 'Incorrecty Password');
            return res.redirect('/users/login');
          }
          // persist the logged in user info
          req.session.userId = user.id;
          res.redirect('/onboarding');
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/forgot-password', (req, res) => {
  res.render('forgot', { message: req.flash('message') });
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  // checking if the user exists with the provided email
  User.findOne({ email })
    .then((user) => {
      const resetToken = user.uniqueString;
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + RESET_TOKEN_EXPIRATION_TIME;
      user.save();

      // sending the password reset email to the user with the reset token
      sendResetEmail(user.email, resetToken);

      return res.json({ message: 'Password reset email sent' });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    });
});

router.get('/reset-password/:uniqueString', (req, res) => {
  const uniqueString = req.params.uniqueString;
  User.findOne({ uniqueString }).then((user) => {
    res.render('reset', { user, uniqueString, message: req.flash('message') });
  });
});

router.post('/reset-password/:uniqueString', (req, res) => {
  const uniqueString = req.params.uniqueString;
  const { password } = req.body;

  User.findOne({ uniqueString })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ message: 'Invalid or expired reset token' });
      }

      // updating  the user's password and clear reset token
      user.password = password;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      user.save();

      return res.redirect('/users/login');
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = router;
