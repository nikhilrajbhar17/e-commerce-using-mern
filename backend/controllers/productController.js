const product = require("../models/product");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
// create new product => api/v1/product/new
// we can also use try catch block to catch the error instead of catchAsyncError function
exports.newProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});
// get all products > api/v1/getproducts
exports.getProducts = catchAsyncError(async (req, res, next) => {
  console.log("reached here");

  const products = await product.find();
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not fount", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// update product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  console.log("update product");
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// delete product api/v1/admin/delete

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not fount", 404));
  }

  const hehe = await Product.findByIdAndDelete(req.params.id);
  console.log(hehe);
  console.log("below product delete line");
  res.status(200).json({
    success: true,
    message: "Product is deleted",
  });
});
