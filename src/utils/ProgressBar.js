import React from 'react';

const ProgressBar = ({ percentage }) => {
  // Ensure percentage is between 0 and 100
  const progress = Math.min(100, Math.max(0, percentage));

  return (
    // ⬇️ CHANGE 1: Centering and Sizing (Parent Container)
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-11/12 md:w-1/2 lg:w-1/3 bg-gray-200 rounded-full h-3 relative overflow-hidden shadow-lg">
        
        {/* ⬇️ CHANGE 2: Good Colors (Progress Bar) */}
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
        
        {/* ⬇️ CHANGE 3: Percentage Text */}
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
          {`${progress.toFixed(0)}% Loading...`}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;