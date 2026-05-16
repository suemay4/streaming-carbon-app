import React from 'react';
import { Leaf } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export function EmissionBreak({ result, chartData }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl min-h-[600px] border border-slate-800/50 flex flex-col">
      {result ? (
        <>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
              <Leaf size={14} className="text-emerald-400" />
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-emerald-400">
                Your Session's Impact
              </span>
            </div>
          </div>

          {/* Chart Container - Fixed sizing to keep text inside */}
          <div className="relative flex justify-center items-center mb-10 h-64 w-full">
            <div className="w-full h-full">
              <Doughnut 
                data={chartData} 
                options={{ 
                  cutout: '85%', // Increased cutout to create more space inside
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: '#0f172a',
                      padding: 12,
                      cornerRadius: 10,
                      callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toFixed(1)}g`
                      }
                    }
                  }
                }} 
              />
            </div>
            
            {/* The Internal Label - Centered absolutely inside the ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">Total Emissions</span>
              <div className="flex items-baseline leading-none">
                <span className="text-5xl font-black text-white tracking-tighter">{result.total}</span>
                <span className="text-lg font-bold text-emerald-500 ml-1">g</span>
              </div>
              <span className="text-[16px] font-bold text-slate-500 uppercase tracking-[0.15em] mt-1">CO₂e</span>
            </div>
          </div>

          {/* Detailed Breakdown Cards */}
          <div className="grid grid-cols-1 gap-3 flex-grow">
            <EmissionItem 
              label="End-User Device" 
              description="Local power usage"
              value={result.breakdown.device} 
              total={result.total}
              color="from-orange-500 to-orange-400"
            />
            <EmissionItem 
              label="Network Transfer" 
              description="Infrastructure & data travel"
              value={result.breakdown.net} 
              total={result.total}
              color="from-purple-500 to-purple-400"
            />
            <EmissionItem 
              label="Data Centers" 
              description="Server-side processing"
              value={result.breakdown.dc} 
              total={result.total}
              color="from-blue-500 to-blue-400"
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow text-center p-12 h-full">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
            <Leaf size={40} className="text-slate-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-300">Awaiting Data</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Enter your streaming habits and click calculate to see results.</p>
        </div>
      )}
    </div>
  );
}

function EmissionItem({ label, description, value, total, color }) {
  const percentage = ((value / total) * 100).toFixed(0);
  
  return (
    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/[0.05] hover:bg-white/[0.06] transition-all">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-white text-sm font-bold uppercase tracking-wider">{label}</p>
          <p className="text-[14px] text-slate-500 font-medium">{description}</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-white">{value}g</span>
          <span className="text-sm font-bold text-slate-500 ml-2">({percentage}%)</span>
        </div>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}