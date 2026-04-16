import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { clearCart } from "../redux/cartSlice";

function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const dispatch = useDispatch();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!address.trim()) {
      setMessage("Please enter your shipping address.");
      return;
    }

    const items = cartItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      size: item.product.size,
      quantity: item.quantity,
    }));

    setProcessing(true);
    setMessage("");

    try {
      const { data } = await api.post("/orders/checkout", {
        items,
        address,
        paymentMethod,
        source: "checkout page",
      });
      setMessage("Order submitted successfully. Thank you!");
      dispatch(clearCart());
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="mx-4 sm:mx-6 lg:mx-20 my-8 rounded-3xl bg-white shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="mt-4 text-gray-600">Your cart is empty. Please add products before checking out.</p>
      </div>
    );
  }

  return (
    <div className="mx-4 sm:mx-6 lg:mx-20 my-8 rounded-3xl bg-white shadow-xl p-8">
      <h1 className="text-3xl font-bold text-gray-900">Payment & Shipping</h1>
      <p className="mt-2 text-gray-600">Review your order and complete checkout.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
          <p className="mt-2 text-sm text-gray-600">Enter the address where the order should be delivered.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={5}
                className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-orange-400 focus:outline-none"
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-orange-400 focus:outline-none"
              >
                <option value="card">Card Payment</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
                <option value="cash">Cash on Delivery</option>
              </select>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-700">Mock Payment Gateway UI</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input className="rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-orange-400 focus:outline-none" placeholder="Card number" />
                <input className="rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-orange-400 focus:outline-none" placeholder="Expiry MM/YY" />
                <input className="rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-orange-400 focus:outline-none" placeholder="CVV" />
                <input className="rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-orange-400 focus:outline-none" placeholder="Name on card" />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? "Processing..." : `Pay ₹${totalPrice}`}
            </button>
          </form>

          {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
        </div>

        <div className="rounded-3xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
          <div className="mt-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex items-start gap-4">
                <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div>
                  <p className="font-semibold text-gray-900">{item.product.name}</p>
                  <p className="text-sm text-gray-600">{item.quantity} × ₹{item.product.price}</p>
                  <p className="text-sm text-gray-600">Size: {item.product.size}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-4">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm font-medium text-gray-900">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
