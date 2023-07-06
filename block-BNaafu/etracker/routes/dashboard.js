var express = require('express');
var router = express.Router();
var Income = require('../models/income');
var Expense = require('../models/expense');
var User = require('../models/user');
var auth = require('../middlewares/auth');

router.use(auth.isUserLoggedIn);

router.get('/', auth.lists, (req, res, next) => {
  let { fromDate, toDate, source, category, month } = req.query;
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth() + 1;
  let currentYear = currentDate.getFullYear();
  let query = { user: req.user._id };

  if (fromDate && toDate) {
    query.date = { $gte: fromDate, $lte: toDate };
  } else if (month) {
    query.date = { $gte: `${month}-01`, $lte: `${month}-30` };
  } else {
    query.date = {
      $gte: `${currentYear}-${currentMonth}-01`,
      $lte: `${currentYear}-${currentMonth}-30`,
    };
  }

  if (source && !fromDate) {
    query = {user: req.user.id, source };
  }
  else if (source) {
    query.source = source;
    query.date = query.date || {};
  }

  if (category && !fromDate) {
    query = { user: req.user.id, category };
  } else if (category) {
    query.category = category;
    query.date = query.date || {};
  }

  if (category && source) {
    query.source = source;
    query.category = category;
  }

  Income.find(query)
    .then((incomes) => {
      Expense.find(query)
        .then((expenses) => {
          
          let totalIncome = incomes.reduce(
            (total, income) => total + income.amount,
            0
          );
          let totalExpense = expenses.reduce(
            (total, expense) => total + expense.amount,
            0
          );
          let totalSavings = totalIncome - totalExpense;

          console.log(totalSavings);
          res.render('dashboard', {
            expenselist: expenses.length > 0,
            incomelist: incomes.length > 0,
            incomes,
            expenses,
            source,
            category,
            totalSavings,
          });
        })
        .catch((error) => {
          console.error(error);
          next(error);
        });
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

router.get('/income/:id/delete', (req, res, next) => {
  var incomeId = req.params.id;

  Income.findOneAndDelete({_id:incomeId})
    .then((income) => {
      if (!income) {
        return res.status(404).send('Income not found.');
      }
      res.redirect('/dashboard');
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/expense/:id/delete', (req, res, next) => {
  var incomeId = req.params.id;

  Expense.findOneAndDelete({_id:incomeId})
    .then((expense) => {
      if (!expense) {
        return res.status(404).send('expense not found.');
      }
      res.redirect('/dashboard');
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
