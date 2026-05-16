// // import React from 'react';

// // export const DeviceComparison = ({ mins, resolution, region, customBitrate, currentDevice, calculateFootprint }) => {
// //   // Define standard power profiles (Watts)
// //   const devices = [
// //     { name: 'Smartphone', power: 5, color: '#10b981' },
// //     { name: 'Laptop', power: 45, color: '#3b82f6' },
// //     { name: 'Smart TV', power: 120, color: '#ef4444' }
// //   ];

// //   const comparisons = devices.map(d => {
// //     // Calculate footprint using the same video data but different device power
// //     const result = calculateFootprint(mins, resolution, d.name, region, customBitrate);
// //     const isCurrent = d.name === currentDevice;
    
// //     return { ...d, total: result.total, isCurrent };
// //   });

// //   // Find the lowest impact for "Savings" calculation
// //   const minImpact = Math.min(...comparisons.map(c => c.total));

// //   return (
// //     <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
// //       <h3 className="text-xl font-bold text-slate-800 mb-2">Device Efficiency Comparison</h3>
// //       <p className="text-sm text-slate-500 mb-8">
// //         See how switching devices changes the carbon footprint of this specific video.
// //       </p>

// //       <div className="space-y-6">
// //         {comparisons.map((item, idx) => (
// //           <div key={idx} className={`p-4 rounded-2xl border ${item.isCurrent ? 'border-green-500 bg-green-50' : 'border-slate-100'}`}>
// //             <div className="flex justify-between items-center mb-2">
// //               <span className="font-bold text-slate-700">
// //                 {item.name} {item.isCurrent && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full ml-2">Current</span>}
// //               </span>
// //               <span className="text-sm font-mono font-bold text-slate-600">{item.total.toFixed(2)}g CO2e</span>
// //             </div>
            
// //             {/* Simple Visual Bar */}
// //             <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
// //               <div 
// //                 className="h-full transition-all duration-1000" 
// //                 style={{ 
// //                   width: `${(item.total / comparisons[2].total) * 100}%`, 
// //                   backgroundColor: item.color 
// //                 }} 
// //               />
// //             </div>

// //             {item.total > minImpact && (
// //               <p className="text-[10px] mt-2 text-slate-400">
// //                 Potential savings: <span className="text-green-600 font-bold">{((item.total - minImpact) / item.total * 100).toFixed(0)}%</span> by switching to mobile.
// //               </p>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };
// import React from 'react';
// import { DEVICE_PROFILES } from '../utils/carbonLogic'; // Import dynamic list

// export const DeviceComparison = ({ mins, resolution, region, currentDevice, calculateFootprint }) => {
  
//   // Use the dynamic list directly
//   const comparisons = DEVICE_PROFILES.map(device => {
//     // Calculate footprint dynamically for each device in your carbonLogic
//     const result = calculateFootprint(mins, resolution, device.name, region);
//     const isCurrent = device.name === currentDevice;
    
//     return { 
//       name: device.name, 
//       total: result.total, 
//       isCurrent 
//     };
//   });

//   const minImpact = Math.min(...comparisons.map(c => c.total));

//   return (
//     <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
//       <h3 className="text-2xl font-bold tracking-tight text-slate-800 mb-2">Device Carbon Comparison</h3>
//       <p className="text-base text-slate-500 mb-8">
//         See how your <span className="font-semibold text-slate-700">{currentDevice}</span> compares to other devices 
//         for this {mins}min {resolution} stream.
//       </p>

//       <div className="space-y-6">
//         {comparisons.map((item, idx) => (
//           <div key={idx} className={`p-4 rounded-2xl border ${item.isCurrent ? 'border-green-500 bg-green-50' : 'border-slate-100'}`}>
//             <div className="flex justify-between items-center mb-2">
//               <span className="font-bold text-slate-700">
//                 {item.name} 
//                 {item.isCurrent && <span className="text-sm bg-green-500 text-white px-2 py-0.5 rounded-full ml-2">Current</span>}
//               </span>
//               <span className="text-base font-mono font-bold text-slate-600">{item.total.toFixed(2)}g CO₂e</span>
//             </div>
            
//             <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
//               <div 
//                 className={`h-full transition-all duration-1000 ${item.isCurrent ? 'bg-green-500' : 'bg-slate-400'}`}
//                 style={{ width: `${(item.total / Math.max(...comparisons.map(c => c.total))) * 100}%` }} 
//               />
//             </div>

//             {item.total > minImpact && (
//               <p className="text-b mt-2 text-slate-400">
//                 Potential savings: <span className="text-green-600 font-bold">{((item.total - minImpact) / item.total * 100).toFixed(0)}%</span>
//               </p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

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