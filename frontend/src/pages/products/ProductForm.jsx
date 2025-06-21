import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import { useAuth } from '../../auth/useAuth';
import { isAdmin } from '../../utils/roleUtils';

const ProductForm = () => {
  const { id } = useParams(); // undefined for create, defined for edit
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    available: true,
  });

  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      ProductService.getProductById(id)
        .then((res) => setFormData(res.data))
        .catch(() => setError('Failed to load product.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  if (!isAdmin(user)) {
    return <div className="text-red-500 text-center mt-6">Access Denied</div>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await ProductService.updateProduct(id, formData);
        alert('Product updated successfully');
      } else {
        await ProductService.createProduct(formData);
        alert('Product created successfully');
      }
      navigate('/products');
    } catch (err) {
      setError('Submission failed. Please check your input or try again.');
    }
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-6">
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h2>

      {error && <div className="text-red-500 mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            required
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
          <label>Available</label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          {isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
