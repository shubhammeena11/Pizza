import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '../redux/cartSlice'
import api from '../api.js'

function Card({product, onProductDeleted}) {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${product._id}`);
      if (onProductDeleted) onProductDeleted(product._id);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product.');
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setLoginPrompt('Please login first to add this product to your cart.');
      window.setTimeout(() => setLoginPrompt(''), 3800);
      return;
    }

    dispatch(addToCart(product));
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600); // Animation duration
  };

  return (
    <>
      <div className='relative w-48 my-10'>
        <img src={`http://localhost:5000/${product.image}`} alt={product.name} className='object-cover object-center h-48 w-48 rounded-full' />
        
        {isAnimating && (
          <div className="absolute bottom-14 right-4 z-20 pointer-events-none">
            <img
              src={`http://localhost:5000/${product.image}`}
              alt={product.name}
              className="w-16 h-16 rounded-full object-cover"
              style={{
                animation: 'flyToCart 0.6s ease-in-out forwards'
              }}
            />
          </div>
        )}
        
        {isAdmin && (
          <div className='absolute top-2 right-2 flex gap-2'>
            <Link
              to={`/product/edit/${product._id}`}
              className='rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-600'
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className='rounded-lg bg-red-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-600'
            >
              Delete
            </button>
          </div>
        )}

        <div className='flex flex-col items-center'>
          <h2 className='font-semibold text-gray-800'>{product.name}</h2>
          <span className='bg-gray-200 rounded-full px-2 mt-1 text-xs'>
            {product.size}
          </span>
          <div className='flex flex-col gap-2 w-full mt-2'>
            <div className='flex items-center justify-between w-full'>
              <span className='font-medium text-gray-900'>₹{product.price}</span>
              <button
                onClick={handleAddToCart}
                className='bg-orange-400 text-white font-medium flex items-center justify-center gap-1 px-3 rounded-full text-xs hover:bg-orange-500 transition'
              >
                ADD
              </button>
            </div>
          </div>
        </div>

        {loginPrompt && (
          <div className='absolute left-1/2 bottom-3 z-10 w-[calc(100%-1rem)] -translate-x-1/2 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700 shadow-sm'>
            <p className='font-semibold'>Please login first</p>
            <p className='text-[11px] text-red-600'>To save items, login before adding products to your cart.</p>
            <div className='mt-2 flex items-center gap-2'>
              <Link to='/login' className='text-xs font-semibold text-orange-600 hover:text-orange-700'>Go to Login</Link>
            </div>
          </div>
        )}
      </div>
      
    </>
  )
}

export default Card
