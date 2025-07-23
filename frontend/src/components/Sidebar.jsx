import { useState } from "react";

const ProductSidebar = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  sortOption,
  onSortChange
}) => {
  const [minPrice, setMinPrice] = useState(priceRange[0]);
  const [maxPrice, setMaxPrice] = useState(priceRange[1]);

  const handlePriceChange = () => {
    onPriceRangeChange([Number(minPrice), Number(maxPrice)]);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm p-6 h-[calc(100vh-3rem)] sticky top-6 flex flex-col gap-8">
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2 border-b pb-4">
        <h3 className="font-semibold mb-2 text-gray-800 uppercase tracking-wide text-xs">Category</h3>
        <div className="flex flex-col gap-1">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`text-left px-2 py-1 rounded transition font-medium text-sm ${selectedCategory === category ? "bg-blue-700 text-white" : "hover:bg-gray-100 text-gray-700"}`}
              style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {category.length > 24 ? category.slice(0, 24) + '…' : category}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-2 border-b pb-4">
        <h3 className="font-semibold mb-2 text-gray-800 uppercase tracking-wide text-xs">Price Range</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-16 px-2 py-1 border rounded"
            placeholder="Min"
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-16 px-2 py-1 border rounded"
            placeholder="Max"
          />
          <button
            onClick={handlePriceChange}
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
          >
            Go
          </button>
        </div>
      </div>
      <div className="mb-2">
        <h3 className="font-semibold mb-2 text-gray-800 uppercase tracking-wide text-xs">Sort By</h3>
        <select
          value={sortOption}
          onChange={e => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
          <option value="name-desc">Name: Z-A</option>
        </select>
      </div>
    </aside>
  );
};

export default ProductSidebar;