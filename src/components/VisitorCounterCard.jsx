import { useState, useEffect } from 'react';

export function VisitorCounterCard() {
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual live backend address from Render
    fetch('https://streaming-carbon-app-backend.onrender.com/api/analytics/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setTotalViews(data.totalViews || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Unable to fetch platform landing count:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse w-full max-w-xs mx-auto">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-sm mx-auto text-left">
      <div className="flex items-center space-x-2.5 mb-2">
        <span className="text-xl">👥</span>
        <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">
          Global Platform Reach
        </p>
      </div>
      <div className="flex items-baseline space-x-2">
        <p className="text-4xl font-black text-emerald-600 tracking-tight">
          {totalViews.toLocaleString()}
        </p>
        <p className="text-xs font-semibold text-gray-400">Malaysians landed on BitLeaf</p>
      </div>
    </div>
  );
}