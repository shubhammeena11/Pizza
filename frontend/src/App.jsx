import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Product from "./components/Product";
import CreateProduct from "./components/CreateProduct.jsx";
import UpdateProduct from "./components/UpdateProduct.jsx";
import Checkout from "./components/Checkout.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import MyOrders from "./components/MyOrders.jsx";
import Login from "./components/Login";
import api from "./api.js";
import { setUser, logout } from "./redux/authSlice";
 
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeUser = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        return;
      }

      try {
        const res = await api.get("/me");
        dispatch(setUser(res.data));
      } catch (err) {
        console.error("Failed to restore user after refresh:", err);
        dispatch(logout());
      }
    };

    initializeUser();
  }, [dispatch]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/create" element={<CreateProduct />} />
            <Route path="/product/edit/:id" element={<UpdateProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/my" element={<MyOrders />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
