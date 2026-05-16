// import React from 'react';
// import { Leaf, Car, Globe, Zap } from 'lucide-react';

// export function ImpactDashboard({ projection }) {
//   return (
//     <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
//       <div className="flex flex-col space-y-6">
//         <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-200 pb-4">
//           <Leaf className="text-green-600" size={28} /> Annual Sustainability Forecast
//         </h3>
        
//         <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden group">
//           <div className="absolute top-0 right-0 p-12 text-slate-50 opacity-50 group-hover:scale-110 transition-all">
//             <Leaf size={180} />
//           </div>
//           <div className="relative z-10">
//             <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-6">Annual Mass</p>
//             <div className="flex items-baseline gap-4 mb-8">
//               <h2 className="text-7xl font-black text-slate-900 tracking-tighter">{projection.yearly}</h2>
//               <span className="text-2xl font-bold text-green-600">kg CO2e</span>
//             </div>
//             <div className="pt-8 border-t border-slate-100">
//               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${parseFloat(projection.yearly) > 100 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
//                 {parseFloat(projection.yearly) > 100 ? 'High Impact' : 'Standard Impact'}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-lg flex items-center gap-4">
//             <div className="bg-white/20 p-3 rounded-xl"><Car size={24} /></div>
//             <div>
//               <p className="text-blue-100 text-[9px] font-black uppercase tracking-widest">Mobility</p>
//               <p className="text-xl font-black">{projection.km} km</p>
//             </div>
//           </div>
//           <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-lg flex items-center gap-4">
//             <div className="bg-green-500/20 p-3 rounded-xl text-green-500"><Globe size={24} /></div>
//             <div>
//               <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Nature</p>
//               <p className="text-xl font-black">{projection.trees} Trees</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { Leaf, Car, TreeDeciduous } from 'lucide-react';

export function ImpactDashboard({ projection }) {
  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-200 pb-4">
        <Leaf className="text-green-600" size={28} /> Annual Carbon Footprint
      </h3>
      
      {/* Main Annual Mass Card */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden group">
        <div className="absolute -top-4 -right-4 p-8 text-slate-50 opacity-30 group-hover:scale-110 transition-transform duration-700">
          <Leaf size={160} />
        </div>
        
        <div className="relative z-10">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-4">Total Annual Carbon Weight</p>
          
          <div className="flex items-baseline gap-2 mb-8">
            <h2 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">{projection.yearly}</h2>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-green-600 leading-none">kg CO2e</span>
              {/* <span className="text-2xl font-black text-green-600 leading-none">CO2e</span> */}
            </div>
          </div>
          
          {/* Monthly Average - Increased Size */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 items-center">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">Monthly Average</p>
              <p className="text-2xl font-extrabold text-slate-800">{projection.monthly}g</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2 ${
                parseFloat(projection.yearly) > 100 
                ? 'bg-red-50 text-red-600 border-red-100' 
                : 'bg-green-50 text-green-600 border-green-100'
              }`}>
                {parseFloat(projection.yearly) > 100 ? 'High Impact' : 'Standard Impact'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Cards - Enhanced Readability */}
      <div className="grid grid-cols-2 gap-6">
        {/* Driving Equivalent Card */}
        <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl shrink-0">
              <Car size={24} />
            </div>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Equivalent to driving...</p>
          </div>
          <div className="min-w-0">
            <p className="text-3xl font-black leading-none my-1">{projection.km} km</p>
            <p className="text-[10px] text-blue-100 font-bold uppercase mt-2">In a passenger vehicle</p>
          </div>
        </div>

        {/* Tree Absorption Card */}
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-xl text-green-500 shrink-0">
              <TreeDeciduous size={24} />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Amount of trees to absorb this...</p>
          </div>
          
          <div className="min-w-0">
            {/* <p className="text-xs text-slate-500 font-medium mb-1 italic"></p> */}
            <p className="text-3xl font-black leading-none my-1">{projection.trees}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Over one full year</p>
          </div>
        </div>
      </div>
    </div>
  );
}