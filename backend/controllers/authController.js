const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");

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
  res.status(201).json({
    success: true,
    user,
  });
});
