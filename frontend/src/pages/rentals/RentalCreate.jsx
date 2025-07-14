import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';

const RentalCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get product and quantity from navigation state
  const { product, quantity = 1 } = location.state || {};
  
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0], // Today's date
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow's date
    notes: '',
    contactPhone: '',
    deliveryAddress: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If no product data, redirect back
  if (!product) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            No product selected
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalCost = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    return days > 0 ? days * product.price * quantity : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }

      if (!formData.contactPhone || !formData.deliveryAddress) {
        throw new Error('Please fill in all required fields');
      }

      // Create rental object
      const rentalData = {
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes,
        contactPhone: formData.contactPhone,
        deliveryAddress: formData.deliveryAddress,
        totalCost: calculateTotalCost(),
        status: 'pending',
        userId: user?.id,
        userName: user?.username
      };

      // For now, simulate API call and store in localStorage
      const existingRentals = JSON.parse(localStorage.getItem('userRentals') || '[]');
      const newRental = {
        ...rentalData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      existingRentals.push(newRental);
      localStorage.setItem('userRentals', JSON.stringify(existingRentals));

      // Show success message
      alert('Rental request submitted successfully! You can view it in your rentals page.');
      
      // Navigate to rentals page
      navigate('/rentals');
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCost = calculateTotalCost();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">Create Rental Request</h1>
            <p className="text-blue-100 mt-1">Fill in the details below to rent this product</p>
          </div>

          <div className="p-6">
            {/* Product Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={product.image || './assets/no-image.jpg'}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-600">{product.category}</p>
                  <p className="text-blue-600 font-semibold">₹{product.price}/day</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="text-lg font-semibold">{quantity}</p>
                </div>
              </div>
            </div>

            {/* Rental Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  placeholder="Enter complete delivery address"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or notes"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cost Summary */}
              {totalCost > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Cost Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Price per day:</span>
                      <span>₹{product.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-blue-900">
                        <span>Total Cost:</span>
                        <span>₹{totalCost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.startDate || !formData.endDate}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isSubmitting || !formData.startDate || !formData.endDate
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader size="sm" className="mr-2" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit Rental Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RentalCreate;
