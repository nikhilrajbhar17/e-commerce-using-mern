const product = require("../models/product");
const Product = require("../models/product");

// create new product => api/v1/product/new

exports.newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
};
// get all products > api/v1/getproducts
exports.getProducts = async (req, res, next) => {
  console.log("reached here");

  const products = await product.find();
  console.log(products.length);
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};

exports.getSingleProduct = async (req, res, next) => {
  console.log("req reached here");
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  res.status(200).json({
    success: true,
    product,
  });
};
