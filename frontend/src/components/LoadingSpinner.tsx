import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-700">Loading...</p>
    </div>
  </div>
);

export default LoadingSpinner;
