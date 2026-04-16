import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, default: "card" },
    source: { type: String, default: "cart page" },
    status: { type: String, default: "Order placed successfully" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
