import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { setUser } from "../redux/authSlice.js";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (isRegister) {
      try {
        await api.post("/register", { name, email, password });
        setMessage("Registration successful. Please login.");
        setIsRegister(false);
      } catch (err) {
        setError(err.response?.data?.message || "Registration failed.");
      }
      return;
    }

    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      const userRes = await api.get("/me");
      dispatch(setUser(userRes.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <>
    <div className="flex justify-center  w-full">
    <div className="p-10 rounded-2xl bg-white shadow-lg max-w-md">
      <h1 className="text-3xl font-bold mb-4">
        {isRegister ? "Register" : "Login"}
      </h1>

      {message && <div className="mb-4 rounded-lg bg-green-50 p-3 text-green-700">{message}</div>}
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-400 focus:outline-none"
            />
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-400 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-400 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-orange-400 px-4 py-3 text-white transition hover:bg-orange-500"
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {isRegister ? (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError("");
                setMessage("");
              }}
              className="font-semibold text-orange-500 hover:text-orange-600"
            >
              Login
            </button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError("");
                setMessage("");
              }}
              className="font-semibold text-orange-500 hover:text-orange-600"
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
    </div>
    </>
  );
}

export default Login;
