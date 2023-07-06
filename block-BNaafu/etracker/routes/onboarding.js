var express = require('express');
var router = express.Router();
var Income = require('../models/income');
var Expense = require('../models/expense');
var User = require('../models/user');
var auth = require('../middlewares/auth');

router.use(auth.isUserLoggedIn);

router.get('/',(req, res, next) => {
  res.render('onboarding');
});

router.post('/income', (req, res, next) => {
  //   let userId = req.user._id;
  //   req.body.user = userId;
  if (req.user) {
    let userId;
    if (req.user.githubId) {
      userId = req.user.githubId;
    } else if (req.user.googleId) {
      userId = req.user.googleId;
    } else {
        userId = req.user._id;
    }

    req.body.user = userId;

  } else {
    // if the user is not verified, use the default user ID 
    req.body.user = 'default_user_id';
  }
    Income.create(req.body)
      .then(() => {
        res.redirect('/dashboard');
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error creating income');
      });
    
});

router.post('/expense', (req, res, next) => {
  // let userId = req.user.id;
  // req.body.user = userId;
  if (req.user) {
    let userId;
    if (req.user.githubId) {
      userId = req.user.githubId;
    } else if (req.user.googleId) {
      userId = req.user.googleId;
    } else {
        userId = req.user._id;
    }

    req.body.user = userId;
  }
    else {
      // if the user is not verified, use the default user ID
      req.body.user = 'default_user_id';
    }
      Expense.create(req.body)
        .then(() => {
          res.redirect('/dashboard');
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send('Error creating expense');
        });
    
});

module.exports = router;
