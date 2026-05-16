import React, { useState } from 'react';
import { Globe, Clock, HdIcon, MonitorSmartphone, CalculatorIcon, CalendarDays, Link, Keyboard, RotateCcw } from 'lucide-react';
import { REGION_FACTORS, DEVICE_PROFILES, RESOLUTION_PROFILES } from '../utils/carbonLogic';

export function CalculatorForm({ 
  videoUrl, setVideoUrl,
  onAnalyze, isAnalyzing,
  region, setRegion, 
  mins, setMins, 
  resolution, setResolution, 
  device, setDevice, 
  onCalculate, error,
  frequency, setFrequency,
  period, setPeriod,
  metadata, onReset
}) {
  // Local state to track which tab is active: 'auto' or 'manual'
  const [activeTab, setActiveTab] = useState('auto');

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Let’s estimate your streaming footprint</h2>
      <p className="text-sm text-slate-500 mt-1">
        Choose automatic detection or enter details manually.
      </p>
      {/* --- TAB SWITCHER --- */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('auto')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'auto'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Link size={16} /> Automated URL Scan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'manual'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Keyboard size={16} /> Manual Estimation
        </button>
      </div>

      {/* --- GLOBAL AREA: LOCATION SETUP (Needed for both modes) --- */}
      <div className="pt-2">
        <label className="block text-sm font-bold text-slate-500 mb-2 uppercase flex items-center gap-2">
          <Globe size={16}/> Where are you watching from?
        </label>
        <select 
          value={region} 
          onChange={(e) => setRegion(e.target.value)} 
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-green-500"
        >
          {Object.keys(REGION_FACTORS).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* --- CONDITIONAL TAB CONTENT --- */}
      {activeTab === 'auto' ? (
        /* TAB 1: AUTOMATED LINK SCAN */
        <div className="space-y-4 animate-fade-in bg-emerald-50/20 p-5 rounded-2xl border border-emerald-100">
          <label className="block text-sm font-bold text-slate-600 uppercase flex items-center gap-2">
            <Link size={16}/> Paste a YouTube Video Link
          </label>
          <div className="flex gap-2">
            <input 
              type="text"
              value={videoUrl} 
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 p-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-green-500 text-sm"
            />
            <button 
              type="button"
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-slate-700 transition-all text-sm disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing video...' : 'Analyze video'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            BitLeaf will scrape the metadata safely to extract video attributes automatically.
          </p>

          {/* --- NEW: DYNAMIC EXTRACTED METADATA DISPLAY --- */}
          {!isAnalyzing && mins > 1 && (
            <div className="mt-4 bg-white p-4 rounded-xl border border-emerald-200 shadow-sm space-y-3 animate-fade-in">
              <div className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold w-max uppercase tracking-wider">
                Extracted Metadata Success
              </div>
              
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 block font-bold uppercase">Video Title</span>
                <p className="text-sm font-bold text-slate-800 line-clamp-1">
                  {metadata?.videoTitle || metadata?.title || "Parsed YouTube Resource Stream"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 block font-bold uppercase">Duration</span>
                  <p className="text-sm font-extrabold text-emerald-600">{mins} Minutes</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-bold uppercase">Video Quality</span>
                  <p className="text-sm font-extrabold text-slate-700">{resolution}</p>
                </div>
              </div>

              {/* Required Local Device Field Dropdown */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1.5 uppercase">
                  <MonitorSmartphone size={14}/> Specify Your Playback Device:
                </label>
                <select 
                  value={device} 
                  onChange={(e) => setDevice(e.target.value)} 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-green-500"
                >
                  {DEVICE_PROFILES.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: MANUAL PARAMETERS */
        <div className="space-y-6 animate-fade-in rounded-2xl"> 
          {/* Slider for Duration */}
          <div>
            <div className="flex justify-between mb-2 text-sm font-bold text-slate-500 items-center">
              <label className="block uppercase flex gap-2"><Clock size={16}/> How long do you watch per day?</label>
              <span className="text-green-600">{mins} Minutes</span>
            </div>
            <input 
              type="range" min="1" max="480" value={mins} 
              onChange={(e) => setMins(e.target.value)} 
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600" 
            />
          </div>

          {/* Quality & Device dropdowns side-by-side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex gap-2 items-center text-sm font-bold text-slate-500 mb-2 uppercase"><HdIcon size={16}/> Video Quality</label>
              <select 
                value={resolution} 
                onChange={(e) => setResolution(e.target.value)} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-green-500"
              >
                {RESOLUTION_PROFILES.map((res) => (
                  <option key={res.value} value={res.value}>{res.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2 uppercase"><MonitorSmartphone size={16}/> What device do you use?</label>
              <select 
                value={device} 
                onChange={(e) => setDevice(e.target.value)} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-green-500"
              >
                {DEVICE_PROFILES.map((d) => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* --- GLOBAL AREA: FREQUENCY & TRIGGER SUBMIT --- */}
      <div className="space-y-6 pt-2">
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-3 uppercase">
            <CalendarDays size={18} /> How often do you stream?
          </label>
          <div className="flex gap-4 items-center">
            <input 
              type="number" 
              min="1" 
              max="100" 
              value={frequency} 
              onChange={(e) => setFrequency(e.target.value)} 
              className="w-24 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-center text-slate-800 focus:border-green-500 outline-none transition-colors" 
            />
            <span className="text-slate-500 font-bold text-sm">time(s) per</span>
            <select 
              value={period} 
              onChange={(e) => setPeriod(e.target.value)} 
              className="flex-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:border-green-500"
            >
              <option value="Daily">Day</option>
              <option value="Weekly">Week</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <span className="text-red-600 font-bold text-xs uppercase tracking-wider block text-center">
              {error}
            </span>
          </div>
        )}

        <div className="flex gap-4 item-stretch">
          <button 
            type="button"
            onClick={onReset} 
            className="px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 hover:text-slate-800 transition-all flex items-center justify-center gap-2 text-sm border border-slate-200"
          >
            <RotateCcw size={16} /> Reset
          </button>
          
          <button 
            type="button"
            onClick={onCalculate} 
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 px-6 rounded-2xl font-bold shadow-lg hover:from-green-700 transition-all flex items-center justify-center gap-2 text-lg"
          >
            <CalculatorIcon size={20} /> Calculate
          </button>
        </div>
      </div>
    </div>
  );
}