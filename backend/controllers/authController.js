const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// register user =>api/v1/register

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "samples/ecommerce/accessories-bag",
      url: "https://res.cloudinary.com/dcjiojvwu/image/upload/v1706751554/samples/ecommerce/accessories-bag.jpg",
    },
  });

  sendToken(user, 200, res);
});

// login user => v1/login/

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // chcks if email and password is entered by user

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  // finding user in database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});
// forgot password  =>api/v1/pass/
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }
  // get rest token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is as follows :\n\n ${resetUrl} \n\n if you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "shopIt password recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `email to send to : ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // hash url token
  const params = req.params.token;
  console.log(params);
  console.log("this is normal param \n");
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(params)
    .digest("hex");

  console.log("normal token is" + req.body.params);
  console.log("encrypted token is " + resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmpassword) {
    return next(new ErrorHandler("password does not match", 400));
  }
  // setup new paswsword
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// get currently logged in user details api/v1
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//  update / change password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  // chck previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect"));
  }
  user.password = req.body.password;
  await user.save();
  sendToken(user, 200, res);
});
// update user profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  console.log(req.body.email);
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  //  update avatar : TODO
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    useFindAndModity: false,
  });
  res.status(200).json({
    success: true,
  });
});
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logged out",
  });
});

// ADMIN ROUTES
// get alluser
exports.allUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// get user details
exports.userDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`user not found with this :id ${req.params.id} `)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// update use profile

exports.updateUser = catchAsyncError(async (req, res, next) => {
  console.log(req.body.email);
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  //  update avatar : TODO
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    useFindAndModity: false,
  });
  res.status(200).json({
    success: true,
  });
});

// delete user -->by admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`user not found with this :id ${req.params.id} `)
    );
  }
  // remove avatar from cloudinary : TODO
  await user.deleteOne();
  res.status(200).json({
    success: true,
    user,
  });
});
