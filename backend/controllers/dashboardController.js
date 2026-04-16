

import { Order } from "../models/index.js";

const dashboardController = {
  async dashboard(req, res, next) {
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

export default dashboardController;