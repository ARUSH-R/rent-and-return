import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
};

export default Loader;
