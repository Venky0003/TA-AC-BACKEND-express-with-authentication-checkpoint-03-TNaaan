let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let incomeSchema = new Schema(
  {
    source: [{type:String, required: true}],
    amount: { type: Number, required: true },
    date: { type: Date, required: true},
    user: { type: Schema.Types.ObjectId, ref:'User', required: true },
  },
  { timestamps: true }
);

let Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
