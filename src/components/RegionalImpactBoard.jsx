import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export function RegionalImpactBoard() {
  const [regionalData, setRegionalData] = useState({ peninsular: 0, sabah: 0, sarawak: 0 });
  const [loading, setLoading] = useState(true);

  const fetchRegionalMetrics = () => {
    fetch('https://streaming-carbon-app-backend.onrender.com/api/analytics/dashboard')
      .then((res) => res.json())
      .then((data) => {
        // Fallback default mock numbers until the first calculation entries register on the network
        setRegionalData(data.regionalEmissions || { peninsular: 0, sabah: 0, sarawak: 0 });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to sync regional metrics data stream:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRegionalMetrics();
    // Long-poll updates every 4 seconds so values tick up live if someone is on the calculator page!
    const interval = setInterval(fetchRegionalMetrics, 4000);
    return () => clearInterval(interval);
  }, []);

  // Format utility to help keep strings short and clear
  const formatEmissions = (grams) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} kg`;
    }
    return `${grams.toFixed(1)} g`;
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-50 rounded-2xl p-6 h-32 animate-pulse border border-slate-100"></div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-left space-y-5">
      <div>
        <div className="flex items-center space-x-2">
          <MapPin size={18} className="text-emerald-600 animate-bounce" />
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Cumulative Regional Footprints Audited
          </h3>
        </div>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          Real-time combined mass of carbon estimations calculated by platform users per geographic grid.
        </p>
      </div>

      {/* 3-Column Regional Data Display Grid */}
      <div className="grid grid-cols-3 gap-4 divide-x divide-slate-100 text-center sm:text-left">
        
        {/* Peninsular Malaysia */}
        <div className="space-y-1 sm:pl-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Peninsular</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight transition-all duration-500">
            {formatEmissions(regionalData.peninsular)}
          </p>
          <span className="inline-block text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100/50">
            High Carbon Intensity Grid
          </span>
        </div>

        {/* Sabah */}
        <div className="space-y-1 px-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sabah</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight transition-all duration-500">
            {formatEmissions(regionalData.sabah)}
          </p>
          <span className="inline-block text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/50">
            Medium Intensity Grid
          </span>
        </div>

        {/* Sarawak */}
        <div className="space-y-1 px-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sarawak</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight transition-all duration-500">
            {formatEmissions(regionalData.sarawak)}
          </p>
          <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
            Low Carbon Hydropower Grid
          </span>
        </div>

      </div>
    </div>
  );
}