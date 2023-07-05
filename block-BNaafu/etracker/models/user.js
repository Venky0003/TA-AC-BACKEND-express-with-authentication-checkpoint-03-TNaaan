let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');

let userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, sparse: true },
    password: { type: String, required: true, default: 'dummy' },
    age: { type: Number },
    phone: { type: Number },
    country: { type: String },
    uniqueString: { type: String },
    isValid: { type: Boolean, default: false },
    githubId: { type: String },
    googleId: { type: String },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

module.exports = mongoose.model('User', userSchema);
