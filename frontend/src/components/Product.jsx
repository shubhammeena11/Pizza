import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Card from './Card.jsx'
import api from '../api.js';

function Product() {
   const [products, setProducts] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [loading, setLoading] = useState(false);
   const user = useSelector((state) => state.auth.user);
   const isAdmin = user?.role === 'admin';

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/products/getall?page=${page}&limit=10`);
      setProducts(Array.isArray(res.data?.data) ? res.data.data : []);
      setTotalPages(res.data?.totalPages ?? 1);
      setCurrentPage(page);
    } catch (err) {
      console.log(err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const handleProductDeleted = (deletedProductId) => {
    setProducts(products.filter(p => p._id !== deletedProductId));
    // Refresh current page to maintain pagination
    fetchProducts(currentPage);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchProducts(page);
    }
  };

  const productList = Array.isArray(products) ? products : [];

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={loading}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
              page === currentPage
                ? 'border-orange-500 bg-orange-500 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      <div className='px-4 sm:px-6 lg:px-20 py-8'>
        <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h2 className='font-bold text-3xl'>Products</h2>
            <p className='text-sm text-gray-600'>Browse all products in the catalog.</p>
          </div>
          {isAdmin && (
            <Link
              to='/product/create'
              className='inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600'
            >
              Add New Product
            </Link>
          )}
        </div>

        <div className='flex flex-wrap justify-between gap-4'>
          {loading ? (
            <div className="flex items-center justify-center w-full py-8">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : productList.length === 0 ? (
            <div className="flex items-center justify-center w-full py-8">
              <p className="text-gray-600">No products found.</p>
            </div>
          ) : (
            productList.map((item) => (
              <Card key={item._id} product={item} onProductDeleted={handleProductDeleted} />
            ))
          )}
        </div>

        {totalPages > 1 && renderPagination()}
      </div>
    </>
  )
}

export default Product
