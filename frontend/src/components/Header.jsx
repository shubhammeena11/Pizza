import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import api, { logoutUser } from "../api.js";
import logo from "../../public/images/logo.png";
import cartlogo from "../../public/images/cart.png";

function Header() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.totalItems);

  const handleLogout = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      await api.post("/logout", { refresh_token });
    } catch (err) {
      console.error("Logout failed", err);
    }

    logoutUser();
  };

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  return (
    <>
    <div className="px-20 flex justify-between items-center fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="flex items-center">
        <div className="self-center h-10">
          <img
            src={logo}
            alt="logo"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <nav className="flex gap-5 items-center p-4 h-fit text-black">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `min-w-15 text-center hover:text-orange-600 ${isActive ? "text-orange-500 font-bold" : ""}`
          }
        >
          Home
        </NavLink>

        {isAdmin && (
          <>
            <NavLink
              to="/product"
              className={({ isActive }) =>
                `min-w-15 text-center hover:text-orange-600 ${isActive ? "text-orange-500 font-bold" : ""}`
              }
            >
              Product
            </NavLink>
          </>
        )}

        {isCustomer && (
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `min-w-15 text-center ${isActive ? "text-orange-500 font-bold" : ""}`
            }
          >
            <div className="bg-orange-500 text-white font-medium flex items-center justify-center  hover:bg-orange-600 gap-1 px-2 h-8 rounded-full">
              <span>{cartItems}</span>
              <img src="public/images/cart.png" alt="cart" />
            </div>
          </NavLink>
        )}

        {!user ? (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `inline-flex items-center justify-center rounded-full bg-orange-500 px-5 h-8 text-sm font-semibold text-white transition hover:bg-orange-600 ${isActive ? "inline-flex items-center justify-center rounded-full bg-orange-500 px-2 py-1 text-sm font-semibold text-white transition hover:bg-orange-600" : ""}`
            }
          >
            Login
          </NavLink>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-2 h-8 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Logout
            </button>
            {showLogoutConfirm && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-orange-200 bg-white p-4 shadow-xl">
                <p className="text-sm font-semibold text-gray-800">Log out?</p>
                <p className="text-xs text-gray-500 mt-1">Are you sure you want to logout from your account?</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogoutConfirm(false);
                    }}
                    className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogoutConfirm(false);
                      handleLogout();
                    }}
                    className="flex-1 rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
    <div className="h-20"></div>
    </>
  );
}

export default Header;
