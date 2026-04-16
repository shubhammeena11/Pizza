import Joi from "joi";
import { Order } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";

const STATUS_PLACED = "Order placed successfully";
const STATUS_PACKED = "Order packed";
const STATUS_DELIVERED = "Order delivered";
const STATUS_CANCELLED = "Order cancelled";

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
      status: STATUS_PLACED,
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

  async getUsersWithOrderCount(req, res, next) {
    try {
      const users = await Order.aggregate([
        {
          $match: {
            status: { $nin: [STATUS_DELIVERED, STATUS_CANCELLED] },
          },
        },
        {
          $group: {
            _id: "$user",
            openOrderCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        { $unwind: "$userInfo" },
        {
          $project: {
            _id: 0,
            userId: "$_id",
            name: "$userInfo.name",
            email: "$userInfo.email",
            openOrderCount: 1,
          },
        },
        { $sort: { openOrderCount: -1, name: 1 } },
      ]);

      res.json({ users });
    } catch (err) {
      return next(err);
    }
  },

  async getOrdersByUser(req, res, next) {
    const { id } = req.params;

    try {
      const [orders, deliveredCount] = await Promise.all([
        Order.find({
          user: id,
          status: { $nin: [STATUS_DELIVERED, STATUS_CANCELLED] },
        })
          .populate("items.product", "name price size")
          .sort({ createdAt: -1 }),
        Order.countDocuments({ user: id, status: STATUS_DELIVERED }),
      ]);

      res.json({ orders, deliveredCount });
    } catch (err) {
      return next(err);
    }
  },

  async updateOrderStatus(req, res, next) {
    const { id } = req.params;
    const schema = Joi.object({
      status: Joi.string().valid(STATUS_PACKED, STATUS_DELIVERED).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const order = await Order.findById(id);
      if (!order) {
        return next(CustomErrorHandler.notFound("Order not found"));
      }

      if (req.body.status === STATUS_PACKED) {
        if (order.status === STATUS_CANCELLED || order.status === STATUS_DELIVERED) {
          return next(CustomErrorHandler.badRequest("Cannot pack this order."));
        }
        order.status = STATUS_PACKED;
      }

      if (req.body.status === STATUS_DELIVERED) {
        if (order.status !== STATUS_PACKED) {
          return next(CustomErrorHandler.badRequest("Order must be packed before it can be delivered."));
        }
        order.status = STATUS_DELIVERED;
      }

      await order.save();
      res.json({ msg: "Order status updated", order });
    } catch (err) {
      return next(err);
    }
  },

  async cancelOrder(req, res, next) {
    const { id } = req.params;

    try {
      const order = await Order.findById(id);
      if (!order) {
        return next(CustomErrorHandler.notFound("Order not found"));
      }

      if (order.status === STATUS_PACKED || order.status === STATUS_DELIVERED) {
        return next(CustomErrorHandler.badRequest("Order is packed now you can't cancel the order."));
      }

      if (order.status === STATUS_CANCELLED) {
        return next(CustomErrorHandler.badRequest("Order is already cancelled."));
      }

      order.status = STATUS_CANCELLED;
      await order.save();
      res.json({ msg: "Order cancelled", order });
    } catch (err) {
      return next(err);
    }
  },

  async getUserOrders(req, res, next) {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate("items.product", "name price size")
        .sort({ createdAt: -1 });

      res.json({ orders });
    } catch (err) {
      return next(err);
    }
  },
};

export default orderController;
