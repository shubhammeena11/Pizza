import React, { useEffect, useState } from "react";
import api from "../api.js";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const STATUS_ORDER = {
    "Order placed successfully": 0,
    "Order packed": 1,
    "Order delivered": 2,
    "Order cancelled": 3,
  };

  const sortOrders = (orderList) =>
    [...orderList].sort((a, b) => {
      const rankA = STATUS_ORDER[a.status] ?? 0;
      const rankB = STATUS_ORDER[b.status] ?? 0;
      if (rankA !== rankB) return rankA - rankB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/orders/my");
        setOrders(sortOrders(data.orders || []));
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Unable to load your orders. Please login or try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    setNotice("");
    try {
      await api.post(`/orders/${orderId}/cancel`);
      const { data } = await api.get("/orders/my");
      setOrders(sortOrders(data.orders || []));
      setNotice("Order cancelled successfully.");
    } catch (err) {
      console.error(err);
      setNotice(err.response?.data?.message || "Unable to cancel the order.");
    }
  };

  const formatStatus = (status) => {
    if (!status || status === "Pending") {
      return "Order placed successfully";
    }
    return status;
  };

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
        <>
          {notice && (
            <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-orange-800">
              {notice}
            </div>
          )}
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
            <div key={order._id} className="rounded-3xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  {order.status && order.status !== "Pending" ? order.status : "Order placed successfully"}
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
                  {order.items?.map((item) => (
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

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                {order.status === "Order packed" || order.status === "Order delivered" || order.status === "Order cancelled" ? (
                  <div className="rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
                    {order.status === "Order packed" && "Order is already packed. Cancellation is not available."}
                    {order.status === "Order delivered" && "Order is already delivered. Cancellation is not available."}
                    {order.status === "Order cancelled" && "Order has been cancelled."}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCancelOrder(order._id)}
                    className="rounded-full border border-red-500 bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}

export default MyOrders;
