import React, { useEffect, useState } from "react";
import api from "../api.js";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [deliveredCount, setDeliveredCount] = useState(0);
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
    const loadUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/orders/users");
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load users. Please check your login or try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const loadUserOrders = async (user) => {
    setSelectedUser(user);
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const { data } = await api.get(`/orders/user/${user.userId}`);
      setOrders(sortOrders(data.orders || []));
      setDeliveredCount(data.deliveredCount ?? 0);
    } catch (err) {
      console.error(err);
      setError("Unable to load that user's orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    setNotice("");
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      if (selectedUser) {
        await loadUserOrders(selectedUser);
      }
      const { data } = await api.get("/orders/users");
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      setNotice(err.response?.data?.message || "Unable to update order status.");
    }
  };

  const handleCancelOrder = async (order) => {
    if (order.status === "Order packed" || order.status === "Order delivered") {
      setNotice("Order is packed now you can't cancel the order.");
      return;
    }

    setNotice("");
    try {
      await api.post(`/orders/${order._id}/cancel`);
      if (selectedUser) {
        await loadUserOrders(selectedUser);
      }
      const { data } = await api.get("/orders/users");
      setUsers(data.users || []);
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
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Select a user to view and manage their orders.</p>

      {notice && (
        <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-orange-800">
          {notice}
        </div>
      )}

      {loading ? (
        <div className="mt-8 text-gray-600">Loading…</div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : selectedUser === null ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {users.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 p-6 text-gray-600">No open orders found yet.</div>
          ) : (
            users.map((user) => (
              <button
                key={user.userId}
                onClick={() => loadUserOrders(user)}
                className="text-left rounded-3xl border border-gray-200 bg-white p-6 transition hover:border-orange-500 hover:bg-orange-50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                    {user.openOrderCount} open orders
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Selected user</p>
              <h2 className="text-2xl font-semibold text-gray-900">{selectedUser.name}</h2>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
              <p className="mt-2 text-sm text-gray-600">Delivered orders: {deliveredCount}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedUser(null);
                setOrders([]);
                setDeliveredCount(0);
                setNotice("");
              }}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back to users
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {orders.length === 0 ? (
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-gray-600">This user has no orders yet.</div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="rounded-3xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                      <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                      {formatStatus(order.status)}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-700">Shipping Address</p>
                      <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{order.address}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-700">Order Info</p>
                      <p className="mt-2 text-sm text-gray-600">Payment: {order.paymentMethod}</p>
                      <p className="mt-1 text-sm text-gray-600">Source: {order.source}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800">Ordered Items</h3>
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
                    {order.status !== "Order delivered" && order.status !== "Order cancelled" ? (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(order._id, order.status === "Order packed" ? "Order delivered" : "Order packed")}
                        className="rounded-full border border-orange-500 bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        {order.status === "Order packed" ? "Mark Delivered" : "Mark Packed"}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
