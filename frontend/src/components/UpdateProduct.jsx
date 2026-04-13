import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";

function UpdateProduct() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const product = response.data;
        setName(product.name);
        setPrice(product.price);
        setSize(product.size);
        setCurrentImage(product.image);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !price || !size) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("size", size);
    if (image) {
      formData.append("image", image);
    }

    setSubmitting(true);

    try {
      await api.put(`/products/${id}`, formData);

      setSuccess("Product updated successfully.");
      setTimeout(() => {
        navigate("/product");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-20 my-8 flex items-center justify-center rounded-3xl bg-white p-8 shadow-xl">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="mx-20 my-8 rounded-3xl bg-white p-8 shadow-xl">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-gray-900">Update Product</h1>
        <p className="max-w-2xl text-gray-600">
          Edit the product details below. You can change the name, price, size, and image.
        </p>
      </div>

      {success && <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">{success}</div>}
      {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="grid gap-6">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Product Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Classic Cheese"
            className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-orange-400 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Price</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 299"
            className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-orange-400 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Size</span>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. Small, Medium, Large"
            className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-orange-400 focus:outline-none"
          />
        </label>

        <div className="block">
          <span className="text-sm font-medium text-gray-700">Current Image</span>
          {currentImage && (
            <div className="mt-2">
              <img
                src={currentImage}
                alt="Current product"
                className="h-40 w-40 rounded-2xl object-cover"
              />
            </div>
          )}
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Upload New Image (Optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-700"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}

export default UpdateProduct;
