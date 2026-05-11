import React from 'react';
import { Globe, Clock, HdIcon, MonitorSmartphone, CalculatorIcon, CalendarDays } from 'lucide-react';
import { REGION_FACTORS } from '../utils/carbonLogic';

export function CalculatorForm({ 
  region, setRegion, 
  mins, setMins, 
  resolution, setResolution, 
  device, setDevice, 
  onCalculate, error,
  frequency, setFrequency,
  period, setPeriod
}) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <h2 className="text-2xl font-bold mb-8 text-slate-800">Tell us about your streaming habits</h2>
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-slate-500 mb-3 uppercase flex items-center gap-2">
            <Globe size={16}/> Select your location
          </label>
          <select 
            value={region} 
            onChange={(e) => setRegion(e.target.value)} 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          >
            {Object.keys(REGION_FACTORS).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <div className="flex justify-between mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider items-center">
            <label className="flex gap-2 items-center"><Clock size={16}/> Daily Duration</label>
            <span className="text-green-600 font-semibold">{mins} Minutes</span>
          </div>
          <input 
            type="range" min="1" max="480" value={mins} 
            onChange={(e) => setMins(e.target.value)} 
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-600" 
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="flex gap-2 items-center text-sm font-bold text-slate-500 mb-3 uppercase"><HdIcon size={16}/> Quality</label>
            <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="360p">360p (SD)</option>
              <option value="1080p">1080p (FHD)</option>
              <option value="4K">4K (UHD)</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-3 uppercase"><MonitorSmartphone size={16}/> Device</label>
            <select value={device} onChange={(e) => setDevice(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <option>Smartphone</option>
              <option>Laptop</option>
              <option>4K TV</option>
            </select>
          </div>
        </div>

        <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-3 uppercase">
                <CalendarDays size={18} /> Streaming Frequency
            </label>
            <div className="flex gap-4 items-center">
                <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={frequency} 
                    onChange={(e) => setFrequency(e.target.value)} 
                    className="w-24 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-l text-center text-slate-800 focus:border-green-500 outline-none transition-colors" 
                />
                <span className="text-slate-500 font-bold text-lg">time(s) per</span>
                <select 
                    value={period} 
                    onChange={(e) => setPeriod(e.target.value)} 
                    className="flex-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-l text-slate-800 outline-none focus:border-green-500"
                >
                    <option value="Daily">Day</option>
                    <option value="Weekly">Week</option>
                </select>
            </div>
        </div>

        {error && (
          <div className="bg-red-50 border-1 border-red-200 p-5 rounded-2xl flex items-center gap-3">
            <span className="text-red-600 font-black text-base uppercase tracking-wider text-center">
              {error}
            </span>
          </div>
        )}

        <button 
          onClick={onCalculate} 
          className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 px-6 rounded-2xl font-bold shadow-lg hover:from-green-700 transition-all flex items-center justify-center gap-2 text-lg"
        >
          <CalculatorIcon size={20} /> Calculate
        </button>
      </div>
    </div>
  );
}