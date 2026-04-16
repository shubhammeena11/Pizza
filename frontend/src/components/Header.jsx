import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api, { logoutUser } from "../api.js";
import logo from "../images/logo.webp";
import cartlogo from "../images/cart.png";

function Header() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.totalItems);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      await api.post("/logout", { refresh_token });
    } catch (err) {
      console.error("Logout failed", err);
    }

    logoutUser();
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed.length === 0) {
      navigate("/product");
    } else {
      navigate(`/product?search=${encodeURIComponent(trimmed)}`);
    }
    setMenuOpen(false);
  };

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  return (
    <>
    <div className="min-h-16 px-4 sm:px-6 lg:px-20 py-3 flex flex-wrap justify-between items-center fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="flex items-center gap-4">
     
        <NavLink to="/" className="flex items-center gap-2 h-10">
          <img src={logo} alt="logo" className="h-10 w-10 object-cover" />
          <span className="hidden sm:inline-flex font-bold text-xl">Pizza</span>
        </NavLink>

        {user && (
          <NavLink
            to="/profile"
            className="hidden sm:flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition hover:bg-orange-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span>Profile</span>
          </NavLink>
        )}

      </div>

      <nav className="hidden sm:flex gap-6 items-center text-black">
        {isCustomer && (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `min-w-15 text-center hover:text-orange-600 ${isActive ? "text-orange-500 font-bold" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/product"
              className={({ isActive }) =>
                `min-w-15 text-center hover:text-orange-600 ${isActive ? "text-orange-500 font-bold" : ""}`
              }
            >
              Product
            </NavLink>
            <NavLink
              to="/orders/my"
              className={({ isActive }) =>
                `min-w-15 text-center hover:text-orange-600 ${isActive ? "text-orange-500 font-bold" : ""}`
              }
            >
              My Orders
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `min-w-15 text-center hover:text-orange-600 ${isActive ? "text-orange-500 font-bold" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `min-w-15 text-center hover:text-orange-600 ${isActive ? "text-orange-500 font-bold" : ""}`
              }
            >
              Dashboard
            </NavLink>
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
      </nav>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <form onSubmit={handleSearchSubmit} className="flex max-w-sm items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search product"
                className="w-full bg-transparent text-sm text-gray-900 focus:outline-none"
              />
              <button type="submit" className="text-gray-500 hover:text-orange-600">
                Search
              </button>
            </form>

            {isCustomer && (
              <NavLink to="/cart" className="hidden sm:inline-flex">
                <div className="bg-orange-500 text-white font-medium flex items-center justify-center gap-1 px-3 h-10 rounded-full hover:bg-orange-600">
                  <span>{cartItems}</span>
                  <img src={cartlogo} alt="cart" className="h-5 w-5 object-contain" />
                </div>
              </NavLink>
            )}

            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-4 h-10 text-sm font-semibold text-white transition hover:bg-orange-600"
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
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `inline-flex items-center justify-center rounded-full bg-orange-500 px-5 h-10 text-sm font-semibold text-white transition hover:bg-orange-600 ${isActive ? "bg-orange-500" : ""}`
            }
          >
            Login
          </NavLink>
        )}

        {user && (
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
        )}
      </div>

    </div>

    {menuOpen && (
      <div className="sm:hidden fixed top-20 left-0 right-0 z-10 bg-white border-t border-gray-200 shadow-sm">
        <nav className="flex flex-col gap-2 p-4 text-black">
          {user && (
            <>
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full text-left rounded-xl px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-800"}`
                }
              >
                Profile
              </NavLink>
              
            </>
          )}
          

          {isCustomer && (
            <>
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full text-left rounded-xl px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-800"}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/product"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full text-left rounded-xl px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-800"}`
                }
              >
                Product
              </NavLink>
              <NavLink
                to="/orders/my"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full text-left rounded-xl px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-800"}`
                }
              >
                My Orders
              </NavLink>
              <NavLink
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full text-left rounded-xl px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-800"}`
                }
              >
                <div className="flex items-center gap-2">
                  <img src={cartlogo} alt="cart" className="h-5 w-5 object-contain" />
                  Cart ({cartItems})
                </div>
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full text-left rounded-xl px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-800"}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full text-left rounded-xl px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-800"}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/product"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full text-left rounded-xl px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-800"}`
                }
              >
                Product
              </NavLink>
            </>
          )}

          {user && (
            <>
             
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left rounded-xl px-3 py-2 text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
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
          ) : null}
        </nav>
      </div>
    )}

    <div className="h-20"></div>
    </>
  );
}

export default Header;
