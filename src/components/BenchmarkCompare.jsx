import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function BenchmarkCompare({ benchmarkData, currentYearly }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Impact of video quality
          </h3>
          <p className="text-base text-slate-400 mt-1">
            Compare Potential Savings
          </p>
        </div>
      </div>

      <div className="space-y-10 w-full flex-grow flex flex-col justify-center">
        {benchmarkData.map((item) => {
          const maxVal = Math.max(...benchmarkData.map(b => b.yearly), currentYearly, 0.1);
          const isEco = item.id === '360p';
          
          return (
            <div key={item.id} className="relative">
              {/* Top Label Row */}
              <div className="flex justify-between items-end mb-3">
                <div className="flex flex-col">
                  <span className={`text-xs font-black tracking-wide flex items-center gap-2 ${
                    item.isCurrent ? 'text-blue-600' : 'text-slate-500'
                  }`}>
                    {item.name}
                    {item.isCurrent && (
                      <span className="bg-blue-100 text-blue-700 text-[9px] px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    )}
                    {isEco && !item.isCurrent && (
                      <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck size={10} /> Lowest emissions option
                      </span>
                    )}
                  </span>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-lg font-black text-slate-900 leading-none">
                        {item.yearly.toFixed(1)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">kg/yr</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${
                    item.isCurrent 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-500' 
                      : item.yearly < currentYearly 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60' 
                        : 'bg-gradient-to-r from-red-500 to-rose-400 opacity-60'
                  }`}
                  style={{ width: `${(item.yearly / maxVal) * 100}%` }}
                />
              </div>

              {/* Status Badge - Floating Right */}
              {!item.isCurrent && (
                <div className="absolute -bottom-6 right-0">
                  <span className={`text-[10px] font-black italic tracking-tighter ${
                    item.yearly < currentYearly ? 'text-emerald-600' : 'text-rose-500'
                  }`}>
                    {item.yearly < currentYearly 
                      ? `↓ Reduce footprint by ${item.savedPercent}%` 
                      : `↑ Increases footprint by ${Math.abs(item.savedPercent)}%`}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Insight */}
      <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
          <strong className="text-slate-700 uppercase">Tip:</strong> Lower video quality reduces data usage, which means less electricity is used to stream videos.
        </p>
      </div>
    </div>
  );
}