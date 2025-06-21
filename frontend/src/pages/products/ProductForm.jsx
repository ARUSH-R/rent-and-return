import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";

/**
 * ProductForm Page
 * - Used for adding or editing a product (admin only)
 * - If editing, loads existing product data
 */
const ProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!productId;

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    stock: "",
  });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imgPreview, setImgPreview] = useState("");

  useEffect(() => {
    if (isEdit) {
      // Fetch product data
      setLoading(true);
      fetch(`/api/products/${productId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch product");
          return res.json();
        })
        .then((data) => {
          setForm({
            name: data.name || "",
            description: data.description || "",
            price: data.price || "",
            image: data.image || "",
            stock: data.stock || "",
          });
          setImgPreview(data.image || "");
        })
        .catch((err) => setError(err.message || "Could not load product"))
        .finally(() => setLoading(false));
    }
  }, [isEdit, productId]);

  const handleInput = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setForm((f) => ({ ...f, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => setImgPreview(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setImgPreview("");
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      let imageUrl = form.image;

      // If uploading a new image file
      if (form.image && form.image instanceof File) {
        const imgData = new FormData();
        imgData.append("file", form.image);
        // Example: replace with your image upload endpoint
        const imgRes = await fetch("/api/upload", {
          method: "POST",
          body: imgData,
        });
        if (!imgRes.ok) throw new Error("Image upload failed");
        const imgResult = await imgRes.json();
        imageUrl = imgResult.url || imgResult.image || "";
      }

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image: imageUrl,
        stock: Number(form.stock),
      };

      const res = await fetch(isEdit ? `/api/products/${productId}` : "/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Failed to ${isEdit ? "update" : "create"} product`);
      navigate("/products");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        {isEdit ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border rounded px-3 py-2"
            value={form.name}
            onChange={handleInput}
            required
            disabled={submitting}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            className="w-full border rounded px-3 py-2 min-h-[70px]"
            value={form.description}
            onChange={handleInput}
            required
            disabled={submitting}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Price (in ₹)</label>
          <input
            type="number"
            name="price"
            className="w-full border rounded px-3 py-2"
            min="0"
            value={form.price}
            onChange={handleInput}
            required
            disabled={submitting}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            className="w-full border rounded px-3 py-2"
            min="0"
            value={form.stock}
            onChange={handleInput}
            required
            disabled={submitting}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Product Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full"
            onChange={handleInput}
            disabled={submitting}
          />
          {imgPreview && (
            <img
              src={imgPreview}
              alt="Product Preview"
              className="mt-2 mb-1 h-28 object-contain border rounded"
            />
          )}
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800 transition disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? <Loader size="sm" /> : isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;