import React, { useState } from 'react'; // Remove useEffect
import { calculateFootprint, REGION_FACTORS } from '../utils/carbonLogic';
import { Globe, Clock, HdIcon, MonitorSmartphone, CalculatorIcon, RefreshCw, Leaf } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Calculator() {
  const [region, setRegion] = useState('Peninsular Malaysia');
  const [device, setDevice] = useState('Laptop');
  const [mins, setMins] = useState(60);
  const [resolution, setResolution] = useState('1080p');
  const [result, setResult] = useState(null); // null = no calculation yet

  // Calculate on button click
  const handleCalculate = () => {
    const data = calculateFootprint(mins, resolution, device, region);
    setResult(data);
  };

  // Reset everything
  const handleReset = () => {
    setResult(null);
    setMins(60);
    setDevice('Laptop');
    setResolution('1080p');
    setRegion('Peninsular Malaysia');
  };

  const chartData = result ? {
    labels: ['Data Center', 'Network', 'Device'],
    datasets: [{
      data: [result.breakdown.dc, result.breakdown.net, result.breakdown.device],
      backgroundColor: ['#3b82f6','#a855f7','#f97316'],
      hoverOffset: 4,
      borderWidth: 0,
    }],
  } : null;

  return (
    <div className="py-12 px-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* INPUTS */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-8 text-slate-800">
            Tell us about your streaming habits
          </h2>
          
          <div className="space-y-8">
            {/* Region */}
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Globe size={16}/> Select Grid Region
              </label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              >
                {Object.keys(REGION_FACTORS).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Duration */}
            <div>
              <div className="flex justify-between mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider items-center">
                <label className="flex gap-2 items-center">
                  <Clock size={16}/> Duration
                </label>
                <span className="text-green-600 font-semibold">{mins} Minutes</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="480" 
                value={mins} 
                onChange={(e) => setMins(e.target.value)} 
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-600" 
              />
            </div>

            {/* Quality + Device */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="flex gap-2 items-center text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
                  <HdIcon size={16}/> Quality
                </label>
                <select 
                  value={resolution} 
                  onChange={(e) => setResolution(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="360p">360p (SD)</option>
                  <option value="1080p">1080p (FHD)</option>
                  <option value="4K">4K (UHD)</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
                  <MonitorSmartphone size={16}/> Device
                </label>
                <select 
                  value={device} 
                  onChange={(e) => setDevice(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option>Smartphone</option>
                  <option>Laptop</option>
                  <option>4K TV</option>
                </select>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleCalculate}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:from-green-700 transition-all flex items-center justify-center gap-2 text-lg"
              >
                <CalculatorIcon size={20} />
                Calculate
              </button>
              {result && (
                <button
                  onClick={handleReset}
                  className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <RefreshCw size={18} className="animate-spin" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="bg-slate-900 rounded-3xl p-10 text-white flex flex-col shadow-2xl min-h-[600px]">
          {result ? (
            <>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                  Total CO₂e Emissions
                </p>
                <div className="text-6xl font-light">
                  {result.total}
                  <span className="text-2xl text-green-400 ml-2 font-medium text-[0.4em]">g</span>
                </div>
              </div>

              {/* Doughnut Chart */}
              <div className="flex-grow flex items-center justify-center py-5 max-h-[320px]">
                <Doughnut 
                  data={chartData} 
                  options={{ 
                    cutout: '75%', 
                    plugins: { 
                      legend: { 
                        position: 'bottom', 
                        labels: { 
                          color: '#94a3b8',
                          padding: 16,
                          usePointStyle: true,
                          font: { size: 12 }
                        }
                      }
                    }
                  }}
                />
              </div>

              {/* Breakdown */}
              <div className="mt-2 space-y-4 border-t border-slate-800 pt-6">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    🖥️ Server (Edc)
                  </span>
                  <span className="font-mono text-blue-400 font-bold">{result.breakdown.dc}g</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    🌐 Network (Enet)
                  </span>
                  <span className="font-mono text-purple-400 font-bold">{result.breakdown.net}g</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    💻 Device (Edevice)
                  </span>
                  <span className="font-mono text-orange-400 font-bold">{result.breakdown.device}g</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow text-center py-20">
              <Leaf size={80} className="text-slate-500 mb-8 opacity-50 animate-pulse" />
              <h3 className="text-3xl font-bold text-slate-400 mb-2">Ready to calculate</h3>
              <p className="text-slate-500 text-lg">Adjust your settings and click Calculate to see your footprint</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calculator;