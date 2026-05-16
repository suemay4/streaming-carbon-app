import React from 'react';
import { DEVICE_PROFILES } from '../utils/carbonLogic';

export const DeviceComparison = ({ mins, resolution, region, currentDevice, calculateFootprint }) => {
  
  const comparisons = DEVICE_PROFILES.map(device => {
    const result = calculateFootprint(mins, resolution, device.name, region);
    const isCurrent = device.name === currentDevice;
    
    return { 
      name: device.name, 
      total: result.total, 
      isCurrent 
    };
  });

  // 1. Find the device object that has the minimum total
  const minImpactDevice = comparisons.reduce((prev, curr) => 
    prev.total < curr.total ? prev : curr
  );

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <h3 className="text-2xl font-bold tracking-tight text-slate-800 mb-2">Device Carbon Comparison</h3>
      <p className="text-base text-slate-500 mb-8">
        See how your <span className="font-semibold text-slate-700">{currentDevice}</span> compares to other hardware 
        for this {mins}min {resolution} stream.
      </p>

      <div className="space-y-6">
        {comparisons.map((item, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${item.isCurrent ? 'border-green-500 bg-green-50' : 'border-slate-100'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-700">
                {item.name} 
                {item.isCurrent && <span className="text-sm bg-green-500 text-white px-2 py-0.5 rounded-full ml-2">Current</span>}
              </span>
              <span className="text-base font-mono font-bold text-slate-600">{item.total.toFixed(2)}g CO₂e</span>
            </div>
            
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${item.isCurrent ? 'bg-green-500' : 'bg-slate-400'}`}
                style={{ width: `${(item.total / Math.max(...comparisons.map(c => c.total))) * 100}%` }} 
              />
            </div>

            {/* 2. DYNAMIC SAVINGS MESSAGE */}
            {!item.isCurrent && item.total > minImpactDevice.total && (
              <p className="text-sm mt-2 text-slate-400">
                Potential savings: <span className="text-green-600 font-bold">
                  {(((item.total - minImpactDevice.total) / item.total) * 100).toFixed(0)}%
                </span> by switching to <span className="font-bold text-slate-600">{minImpactDevice.name}</span>.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};