import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api.js";
import { setUser } from "../redux/authSlice";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeat_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        password: "",
        repeat_password: "",
      }));
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password && formData.password !== formData.repeat_password) {
      setError("Passwords do not match.");
      setNotice("");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        payload.password = formData.password;
        payload.repeat_password = formData.repeat_password;
      }

      const { data } = await api.put("/me", payload);
      dispatch(setUser(data));
      setNotice("Profile updated successfully.");
      setFormData((prev) => ({ ...prev, password: "", repeat_password: "" }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-4 sm:mx-6 lg:mx-20 my-8 rounded-3xl bg-white shadow-xl p-8">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      <p className="mt-2 text-gray-600">View and update your account details here.</p>

      {notice && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          {notice}
        </div>
      )}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Name</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Your name"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Email</span>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
              required
            />
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">New Password</span>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Leave blank to keep current password"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Confirm Password</span>
            <input
              name="repeat_password"
              value={formData.repeat_password}
              onChange={handleChange}
              type="password"
              placeholder="Repeat new password"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
