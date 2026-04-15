import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import api, { logoutUser } from "../api.js";
import logo from "../images/logo.png";
import cartlogo from "../images/cart.png";

function Header() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    <div className="px-4 sm:px-6 lg:px-20 flex flex-wrap justify-between items-center fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="flex items-center gap-4">
        <div className="self-center h-10">
          <NavLink
            to="/">
          <img
            src={logo}
            alt="logo"
            className="h-full w-full object-cover"
            />
            </NavLink>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="sm:hidden inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-100"
          aria-label="Toggle navigation menu"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>

        <nav className="hidden sm:flex gap-5 items-center p-4 h-fit text-black">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `min-w-15 text-center hover:text-orange-600 ${isActive ? "text-orange-500 font-bold" : ""}`
            }
          >
            Home
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/product"
              className={({ isActive }) =>
                `min-w-15 text-center hover:text-orange-600 ${isActive ? "text-orange-500 font-bold" : ""}`
              }
            >
              Product
            </NavLink>
          )}

          {isCustomer && (
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `min-w-15 text-center ${isActive ? "text-orange-500 font-bold" : ""}`
              }
            >
              <div className="bg-orange-500 text-white font-medium flex items-center justify-center hover:bg-orange-600 gap-1 px-2 h-8 rounded-full">
                <span>{cartItems}</span>
                <img src={cartlogo} alt="cart" className="h-4 w-4 object-contain" />
              </div>
            </NavLink>
          )}

          {!user ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `inline-flex items-center justify-center rounded-full bg-orange-500 px-5 h-8 text-sm font-semibold text-white transition hover:bg-orange-600 ${isActive ? "bg-orange-500" : ""}`
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
    </div>

    {menuOpen && (
      <div className="sm:hidden fixed top-20 left-0 right-0 z-10 bg-white border-t border-gray-200 shadow-sm">
        <nav className="flex flex-col gap-2 p-4 text-black">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `w-full text-left rounded-xl px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-800"}`
            }
          >
            Home
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/product"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `w-full text-left rounded-xl px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-800"}`
              }
            >
              Product
            </NavLink>
          )}

          {isCustomer && (
            <NavLink
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `w-full text-left rounded-xl px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-800"}`
              }
            >
              <div className="flex items-center gap-2 text-gray-800">
                <span>{cartItems}</span>
                <img src={cartlogo} alt="cart" className="h-5 w-5 object-contain" />
                Cart
              </div>
            </NavLink>
          )}

          {!user ? (
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 ${isActive ? "bg-orange-500" : ""}`
              }
            >
              Login
            </NavLink>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setShowLogoutConfirm(true);
              }}
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    )}

    <div className="h-20"></div>
    </>
  );
}

export default Header;
