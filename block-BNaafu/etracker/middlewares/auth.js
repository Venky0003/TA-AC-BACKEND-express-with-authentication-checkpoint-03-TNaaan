var User = require('../models/user');
var Income = require('../models/income');
var Expense = require('../models/expense');

module.exports = {
  isUserLoggedIn: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else if (req.session.passport && req.session.passport.user) {
      next();
    } else {
      req.flash('warn', 'Unauthorized Access');
      req.session.returnsTo = req.originalUrl;
      return res.redirect('/users/login');
    }
  },
  userInfo: (req, res, next) => {
    if (req.session && req.session.userId) {
      var userId = req.session && req.session.userId;
    } else if (req.session.passport && req.session.passport.user) {
      var userId = req.session.passport && req.session.passport.user;
    }
    // let userId = req.session && req.session.userId;
    if (userId) {
      User.findById(userId, 'name email').then((user) => {
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },

  lists: (req, res, next) => {
    Income.distinct('source').then((incomes) => {
      Expense.distinct('category').then((categories) => {
        req.sources = incomes;
        res.locals.sources = incomes;
        req.categories = categories;
        res.locals.categories = categories;
        next();
      });
    });
  },
};
