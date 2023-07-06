let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let expenseSchema = new Schema(
  {
    category: [{ type: String, required: true }],
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

let Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
