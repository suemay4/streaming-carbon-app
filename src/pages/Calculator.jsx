import React, { useState } from 'react';
import { calculateFootprint, REGION_FACTORS } from '../utils/carbonLogic';
import { Globe, Clock, HdIcon, MonitorSmartphone, CalculatorIcon, RefreshCw, CalendarDays, Leaf, Car, Zap } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Calculator() {
  const [region, setRegion] = useState('Peninsular Malaysia');
  const [device, setDevice] = useState('Laptop');
  const [mins, setMins] = useState(0);
  const [resolution, setResolution] = useState('1080p');
  const [result, setResult] = useState(null); // null = no calculation yet
  const [frequency, setFrequency] = useState(1);
  const [period, setPeriod] = useState('Daily'); 
  const [projection, setProjection] = useState(null);
  const [benchmarkData, setBenchmarkData] = useState([]);

  // Calculate on button click
const handleCalculate = () => {
  const sessionData = calculateFootprint(mins, resolution, device, region);
    
  // Calculate Projection
  const timesPerYear = period === 'Daily' ? (frequency * 365) : (frequency * 52);
  const yearlyKg = (sessionData.total * timesPerYear) / 1000;
  const monthlyKg = yearlyKg / 12;

  // 2. Valid Comparisons (Calculated based on Yearly Impact)    const kmDriven = yearlyKg / 0.12;           // Distance in KM
  const phoneCharges = yearlyKg / 0.005;      // Number of charges
  const treesRequired = yearlyKg / 21;        // Trees needed for 1 year
    
  setResult(sessionData);
  setProjection({
    monthly: (monthlyKg * 1000).toFixed(2), // back to grams for display
    yearly: yearlyKg.toFixed(2),
    km: kmDriven.toFixed(1),
    charges: Math.floor(phoneCharges),
    trees: treesRequired.toFixed(2)
  });

  // Function to get annual kg for any resolution
  const getYearlyForRes = (res) => {
    const timesPerYear = period === 'Daily' ? (frequency * 365) : (frequency * 52);
    const data = calculateFootprint(mins, res, device, region);
    return (data.total * timesPerYear) / 1000;
  };

  const scenarios = [
    { id: '360p', name: 'QUICK WATCH', color: 'bg-emerald-500' },
    { id: '1080p', name: 'BALANCED', color: 'bg-blue-500' },
    { id: '4K', name: 'QUALITY LOVER', color: 'bg-red-500' }
  ];

  const currentYearly = parseFloat(projection.yearly);

  // Map the data and find the max value to scale the bars correctly
  const benchmarkData = scenarios.map(s => {
    const yearly = getYearlyForRes(s.id);
    const savedPercent = ((currentYearly - yearly) / currentYearly * 100).toFixed(0);
    return { ...s, yearly, savedPercent, isCurrent: resolution === s.id };
  });

  const maxVal = Math.max(...benchmarkData.map(b => b.yearly), currentYearly);

  // Reset everything
  const handleReset = () => {
    setResult(null);
    setMins(0);
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
};

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

            {/* Frequency Input */}
            <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
              <label className="flex items-center gap-2 text-sm font-bold text-green-700 mb-4 uppercase tracking-wider">
                <CalendarDays size={16}/> Streaming Frequency
              </label>
            <div className="flex gap-4 items-center">
              <input 
                type="number" 
                min="1" 
                max="100"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-20 p-3 bg-white border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-center"
              />
              <span className="text-slate-600 font-medium text-sm text-center">time(s) per</span>
                <select 
                  value={period} 
                  onChange={(e) => setPeriod(e.target.value)}
                  className="flex-1 p-3 bg-white border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold"
                >
                  <option value="Daily">Day</option>
                  <option value="Weekly">Week</option>
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

        {/* BOTTOM TIER: Impact Dashboard */}
        {result && projection && benchmarkData.length > 0 && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Leaf className="text-green-600" size={28} /> 
                Annual Sustainability Forecast
              </h3>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN: THE TOTAL WEIGHT (60% width) */}
              <div className="lg:col-span-7 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 text-slate-50 opacity-50 group-hover:scale-110 transition-transform duration-700">
                  <Leaf size={180} />
                </div>
                <div className="relative z-10">
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-6">Cumulative Annual Mass</p>
                  <div className="flex items-baseline gap-4 mb-8">
                    <h2 className="text-9xl font-black text-slate-900 tracking-tighter leading-none">
                      {projection.yearly}
                    </h2>
                    <span className="text-4xl font-bold text-green-600">kg CO₂e</span>
                  </div>
          
                  <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Monthly Average</p>
                      <p className="text-2xl font-bold text-slate-700">{projection.monthly}g</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Efficiency Tier</p>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${projection.yearly > 100 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {projection.yearly > 100 ? 'High Impact' : 'Standard Impact'}
                        </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: EQUIVALENTS (40% width) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
              {/* MOBILITY CARD */}
                <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-lg flex items-center gap-6 relative overflow-hidden group">
                  <div className="bg-white/20 p-4 rounded-2xl">
                    <Car size={32} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Mobility Equivalent</p>
                    <p className="text-3xl font-black">{projection.km} km</p>
                    <p className="text-blue-100 text-xs opacity-80">Driving a Perodua/Proton</p>
                  </div>
                </div>

              {/* NATURE OFFSET CARD */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-lg flex flex-col justify-between flex-grow relative overflow-hidden group">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="bg-green-500/20 p-4 rounded-2xl text-green-500">
                      <Globe size={32} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Nature Debt</p>
                      <p className="text-3xl font-black text-white">{projection.trees} <span className="text-sm font-light text-slate-400">Trees</span></p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed italic border-t border-slate-800 pt-4">
                  * Neutralization requires the sequestration capacity of {projection.trees} mature trees for 1 full year.
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
                  Comparative Benchmarking
                </h3>
                <div className="space-y-8">
                {/* CURRENT SETUP - THE REFERENCE POINT */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-slate-900 tracking-widest">YOUR CURRENT SETUP</span>
                      <span className="text-xl font-black text-slate-900">{projection.yearly}kg</span>
                    </div>
                    <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${(currentYearly / maxVal) * 100}%` }}/>
                    </div>
                  </div>

                {/* OTHER SCENARIOS */}
                  {benchmarkData.map((item) => (
                    !item.isCurrent && (
                      <div key={item.id} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-700">{item.yearly.toFixed(1)}kg</span>
                              <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-1">
                                {item.yearly < currentYearly ? `⬅ ${item.savedPercent}% ↓` : `➡ ${Math.abs(item.savedPercent)}% ↑`}
                              </span>
                          </div>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} opacity-60 transition-all duration-1000`} style={{ width: `${(item.yearly / maxVal) * 100}%` }}/>
                        </div>
                      </div>
                    )
                  ))}
                </div>
                <p className="mt-8 text-[10px] text-slate-400 text-center font-medium italic">
                  * Comparisons calculated based on your selected {device} and {region} grid intensity.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;