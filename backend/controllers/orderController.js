const Order = require("../models/order");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");

// create a new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderedItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderedItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(200).json({
    success: true,
    order,
  });
});

// get single order

// get logged in user's order
exports.myOrders = catchAsyncError(async (req, res, next) => {
  //   console.log(req);
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get single order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("no order found with this id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// get all orders -->> admin

exports.allOrders = catchAsyncError(async (req, res, next) => {
  //   console.log(req);
  const orders = await Order.find({});
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update precessed orders
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  //   console.log(req);
  const order = await Order.findById(req.params.id);
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order"), 400);
  }
  order.orderedItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  res.status(200).json({
    success: true,
    order,
  });
});
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}

// delete order

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("no order found with this id", 404));
  }
  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});
