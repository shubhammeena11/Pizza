import Joi from "joi";
import mongoose from "mongoose";
import { Order } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";

const orderController = {
  async checkout(req, res, next) {
    const schema = Joi.object({
      items: Joi.array()
        .items(
          Joi.object({
            product: Joi.string().required(),
            name: Joi.string().required(),
            price: Joi.number().required(),
            size: Joi.string().required(),
            quantity: Joi.number().min(1).required(),
          })
        )
        .min(1)
        .required(),
      address: Joi.string().min(10).required(),
      paymentMethod: Joi.string().valid("card", "upi", "netbanking", "cash").required(),
      source: Joi.string().allow(""),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { items, address, paymentMethod, source } = req.body;

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
      user: req.user._id,
      items,
      total,
      address,
      paymentMethod,
      source: source || "cart page",
    };

    try {
      const order = await Order.create(orderData);
      res.status(201).json({ msg: "Order placed successfully", order });
    } catch (err) {
      return next(err);
    }
  },

  async getAllOrders(req, res, next) {
    try {
      const orders = await Order.find()
        .populate("user", "name email role")
        .populate("items.product", "name price size")
        .sort({ createdAt: -1 });

      res.json({ orders });
    } catch (err) {
      return next(err);
    }
  },
};

export default orderController;
