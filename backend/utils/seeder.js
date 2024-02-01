const Product = require("../models/product");
const dotenv = require("dotenv");
const db = require("../config/database");
const products = require("../data/product");

dotenv.config("backend/config/config.env");


const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("products are deleted");
    await Product.insertMany(products);
    console.log("all products are added");  
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};
seedProducts();
