let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let sourceOfIncomeSchema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

let SourceOfIncome = mongoose.model('SourceOfIncome', sourceOfIncomeSchema);

module.exports = SourceOfIncome;