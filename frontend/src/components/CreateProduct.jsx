import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

function CreateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !price || !size || !image) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("size", size);
    formData.append("image", image);

    setSubmitting(true);

    try {
      await api.post("/products", formData);

      setSuccess("Product created successfully.");
      setName("");
      setPrice("");
      setSize("");
      setImage(null);

      setTimeout(() => {
        navigate("/product");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-20 my-8 rounded-3xl bg-white p-8 shadow-xl">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-gray-900">Create New Product</h1>
        <p className="max-w-2xl text-gray-600">
          Add a fresh product to the catalog. Upload an image, set the price, and specify the product size.
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

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Image</span>
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
          {submitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
