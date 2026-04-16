import React, { useEffect, useState } from "react";
import api from "../api.js";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load your orders. Please login or try again.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="mx-4 sm:mx-6 lg:mx-20 my-8 rounded-3xl bg-white shadow-xl p-8">
      <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      <p className="mt-2 text-gray-600">Track your past purchases and order details here.</p>

      {loading ? (
        <div className="mt-8 text-gray-600">Loading your orders…</div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : orders.length === 0 ? (
        <div className="mt-8 text-gray-600">You haven't placed any orders yet.</div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="rounded-3xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                  {order.status || "Pending"}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-700">Shipping Address</p>
                  <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{order.address}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-700">Order Summary</p>
                  <p className="mt-2 text-sm text-gray-600">Total: ₹{order.total}</p>
                  <p className="mt-1 text-sm text-gray-600">Payment: {order.paymentMethod}</p>
                  <p className="mt-1 text-sm text-gray-600">Source: {order.source}</p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800">Items</h3>
                <div className="mt-4 space-y-4">
                  {order.items.map((item) => (
                    <div key={item.product ? item.product._id : item._id} className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right text-sm font-semibold text-gray-900">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
