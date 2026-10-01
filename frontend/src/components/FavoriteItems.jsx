import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Card from "./Card.jsx";

function FavoriteItems() {
    

  const favorites = useSelector((state) => state.favorite.items);
   const [searchParams] = useSearchParams();
const search = searchParams.get("search") || "";
useEffect(() => {
  setCurrentPage(1);
}, [search]);
 const filteredFavorites = favorites.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const visibleFavorites = filteredFavorites.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
 

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-20 py-8">
      <div className="mb-6">
        <h2 className="font-bold text-3xl">Favorite Items</h2>
        <p className="text-sm text-gray-600">
          Your favorite products are saved here.
        </p>
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="rounded-3xl bg-white shadow-xl p-8">
          <p className="text-gray-600">
            You haven't added any favorite items yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleFavorites.map((product) => (
            <Card key={product._id} product={product} />
          ))}
        </div>

      )}

      {totalPages > 1 && (
  <div className="flex items-center justify-center gap-2 mt-8">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Prev
    </button>

    <span className="px-3 py-2 text-sm">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}
      
    </div>
    
  );
}

export default FavoriteItems;
