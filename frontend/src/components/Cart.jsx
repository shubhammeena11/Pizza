import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateQuantity, removeFromCart, clearCart } from '../redux/cartSlice'
import cart from "../../public/images/empty-cart.png";

function Cart() {
  const cartItems = useSelector((state) => state.cart.items)
  const totalPrice = useSelector((state) => state.cart.totalPrice)
  const dispatch = useDispatch()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId))
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }))
    }
  }

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId))
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      dispatch(clearCart())
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-20 my-8 flex flex-col items-center justify-center min-h-100 rounded-3xl bg-white shadow-xl">
        <img
          src={cart}
          alt="Empty Cart"
          className="w-48 h-48 mb-6 opacity-75"
        />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 text-center max-w-md">
          Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
        </p>
      </div>
    )
  }

  return (
    <div className="mx-20 my-8 rounded-3xl bg-white shadow-xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <button
          onClick={handleClearCart}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                <p className="text-sm text-gray-600">{item.product.size}</p>
                <p className="text-sm font-medium text-gray-900">₹{item.product.price}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <p className="font-semibold text-gray-900">₹{item.product.price * item.quantity}</p>

              <button
                onClick={() => handleRemoveItem(item.product._id)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span>₹{totalPrice}</span>
        </div>
        <button className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart
