// import React, { forwardRef } from 'react';
// import { Leaf, Car, Globe, Info } from 'lucide-react';

// export const CarbonReport = forwardRef(({ result, projection, region }, ref) => {
//     if (!result || !projection) return null;
//     return (
//         <div 
//             ref={ref} 
//             className="p-12 bg-white text-slate-900 w-[794px] min-h-[1123px] mx-auto"
//             style={{ fontFamily: 'sans-serif' }}
//         >
//             {/* PDF Header */}
//             <div className="border-b-4 border-green-600 pb-6 mb-8 flex justify-between items-end">
//                 <div>
//                     <h1 className="text-4xl font-black uppercase tracking-tight">Digital Carbon Report</h1>
//                     <p className="text-slate-500 font-bold mt-1">Generated on {new Date().toLocaleDateString()}</p>
//                 </div>
//                 <Leaf className="text-green-600" size={48} />
//             </div>

//             {/* Summary Section */}
//             <div className="grid grid-cols-2 gap-8 mb-12">
//                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
//                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Session Impact</p>
//                     <div className="flex items-baseline gap-2">
//                         <span className="text-5xl font-black">{result.total}</span>
//                         <span className="text-xl font-bold text-green-600">g CO2e</span>
//                     </div>
//                 </div>
//                 <div className="bg-slate-900 p-6 rounded-2xl text-white">
//                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Annual Forecast</p>
//                     <div className="flex items-baseline gap-2">
//                         <span className="text-5xl font-black">{projection.yearly}</span>
//                         <span className="text-xl font-bold text-green-400">kg CO2e</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Comparisons Section */}
//             <h3 className="text-xl font-black mb-6 border-l-4 border-blue-600 pl-4">Environmental Equivalents</h3>
//             <div className="grid grid-cols-2 gap-6 mb-12">
//                 <div className="border-2 border-slate-100 p-6 rounded-2xl">
//                     <Car className="text-blue-600 mb-4" size={32} />
//                     <p className="text-2xl font-black">{projection.km} km</p>
//                     <p className="text-sm text-slate-500 font-medium italic">Equivalent driving distance</p>
//                 </div>
//                 <div className="border-2 border-slate-100 p-6 rounded-2xl">
//                     <Globe className="text-green-600 mb-4" size={32} />
//                     <p className="text-2xl font-black">{projection.trees} Trees</p>
//                     <p className="text-sm text-slate-500 font-medium italic">Annual absorption needed</p>
//                 </div>
//             </div>

//             {/* Methodology Section */}
//             <div className="mt-auto bg-slate-50 p-8 rounded-3xl border border-slate-100">
//                 <div className="flex items-center gap-2 mb-4">
//                     <Info size={20} className="text-slate-400" />
//                     <h4 className="font-black text-slate-700 uppercase text-sm tracking-widest">Methodology Note</h4>
//                 </div>
//                 <p className="text-sm text-slate-600 leading-relaxed font-medium">
//                     Calculations are based on the <strong>{region}</strong> electricity grid factor[cite: 1, 2]. 
//                     This report utilizes a bottom-up energy intensity model accounting for data centers ($E_{dc}$), 
//                     network infrastructure ($E_{net}$), and end-user devices ($E_{device}$)[cite: 2].
//                 </p>
//             </div>
//         </div>
//     );
// });