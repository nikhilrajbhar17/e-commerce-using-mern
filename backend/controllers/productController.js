const product = require("../models/product");
const Product = require("../models/product");

// create new product => api/v1/product/new

exports.newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(2001).json({
    success: true,
    product,
  });
};
// get all products > api/v1/getproducts
exports.getProducts = async (req, res, next) => {
  const products = await product.find();
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};
