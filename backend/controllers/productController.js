const product = require("../models/product");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncError");
const APIFeatures = require("../utils/apiFeatures");
// create new product => api/v1/product/new

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});
// get all products > api/v1/getproducts
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  const productCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    count: products.length,
    productCount,
    products,
  });
});

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
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
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
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

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }

  const hehe = await Product.findByIdAndDelete(req.params.id);
  console.log(hehe);
  console.log("below product delete line");
  res.status(200).json({
    success: true,
    message: "Product is deleted",
  });
});
