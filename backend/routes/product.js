const express = require("express");
const router = express.Router();
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProduct);
router.route("/admin/products/new").post(newProduct);
console.log("req reqched hre");
router.route("/admin/product/:id").put(updateProduct).delete(deleteProduct);

console.log("req reqched hre");

module.exports = router;
