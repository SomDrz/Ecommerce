
const Order = require("../model/order.js")
const Product = require("../model/product.js");


const newOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error.stack)
  }

};


const getsingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email")

    if (!order) {
      res.status(404).json({ message: "no order" });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {

  }
}
//get logged in user orders

const myOrder = async (req, res) => {
  try {
    // console.log(req.user,"hi")
    const orders = await Order.aggregate([{ $match: { user: req.user._id } }])
    if (!orders) {
      res.status(500).json({ message: "order not found" });
    }

    res.status(200).json(
      orders
    )
  } catch (error) {
    console.log(error.stack)
  }
}

//get all order      ----admin---
const getallOrder = async (req, res) => {
  const orders = await Order.find();
  let totalAmount = 0;

  orders.forEach((val) => {
    totalAmount = val.totalPrice
  })

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });

}

// UPDATE ODRER status --- admin ---
const updateOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    res.status(404).json({ message: "order not found" });
  }

  if (order.orderStatus === "Delivered") {
    res.status(404).json({ message: "already deliverd" });
  }

  if (req.body.status === "Shipped") {  //if item out for ship then we need to update
    order.orderItems.forEach(async (value) => {
      await updateStock(value.product, value.quantity)
    })
  }
  order.orderStatus = req.body.status;

  if (order.orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validationBeforeSve: false })

  res.status(404).json({ message: "already deliverd" });

}
async function updateStock(id, quantity) {
  const product = await Product.findById(id)
  product.Stock -= quantity

}


const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).json({ message: "order not found" });
  }
  
  await order.deleteOne()

  res.status(200).json({
    success: true,
  });
}

module.exports = {
  newOrder, getsingleOrder, myOrder, getallOrder, updateOrder, deleteOrder
}