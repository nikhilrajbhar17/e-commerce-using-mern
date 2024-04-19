const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const  jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Your name can not exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "please enter the password"],
    minlength: [6, "Your password must be longer than 6 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// encryting password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
// return JWT
userSchema.methods.getJwtToken= function(){
 return jwt.sign({id : this._id}, process.env.JWT_SECRET,{
  expiresIn : process.env.JWT_EXPIRES_TIME
 });
}
// exporting the model
module.exports = mongoose.model("User", userSchema);
