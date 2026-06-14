import React, { useState } from 'react'; //useRef
import { calculateFootprint, REGION_FACTORS, DEVICE_PROFILES, RESOLUTION_PROFILES } from '../utils/carbonLogic';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image-more';

// Import new subcomponents
import { CalculatorForm } from '../components/CalculatorForm';
import { EmissionBreak } from '../components/EmissionBreak';
import { ImpactDashboard } from '../components/ImpactDashboard';
import { BenchmarkCompare } from '../components/BenchmarkCompare';
import { generateCarbonReport } from '../utils/pdfGenerator';
import { DeviceComparison } from '../components/DeviceComparison';

function Calculator() {
  // Centralised State
  const [region, setRegion] = useState('Peninsular Malaysia');
  const [device, setDevice] = useState('Smartphone');
  const [mins, setMins] = useState(0);
  const [resolution, setResolution] = useState('360p');
  const [frequency, setFrequency] = useState(1);
  const [period, setPeriod] = useState('Daily');
  const [result, setResult] = useState(null);
  const [projection, setProjection] = useState(null);
  const [benchmarkData, setBenchmark] = useState([]);
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [customBitrate, setCustomBitrate] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');

  const [recentAudits, setRecentAudits] = useState([]);
  const [isLogsLoading, setIsLogsLoading] = useState(true);

  const handleAnalyze = async () => {
    if (!videoUrl) return;
    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('https://streaming-carbon-app-backend.onrender.com/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      console.log("Backend Data Received:", data) // check f12 for this

      // Auto-update state variables with real data
      if (data.durationMins) {
        setVideoTitle(data.title);
        setMins(data.durationMins);
        
        // 🌟 FIX 1: Map the incoming data to your actual core matrix lookup keys
        if (data.resolution.includes('2160') || data.resolution.includes('4K')) {
          setResolution('2160p_4k');
        } else if (data.resolution.includes('1440')) {
          setResolution('1440p');
        } else if (data.resolution.includes('1080')) {
          setResolution('1080p');
        } else if (data.resolution.includes('720')) {
          setResolution('720p');
        } else {
          setResolution('360p_480p'); // Standard baseline matching key
        }
        
        // 🌟 FIX 2: Do NOT set customBitrate here if you want the dropdown to handle the math!
        // Leaving customBitrate as null ensures the app looks up values directly from RESOLUTION_PROFILES
        setCustomBitrate(null); 
      }
    
      alert(`Successfully analyzed: ${data.title}`);
    } catch (err) {
      alert("Could not analyze link. Please paste a valid public YouTube link.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Main Action Handler
  const handleCalculate = () => {
    if (!mins || mins <= 0) {
      setError('Please input streaming minutes to see your impact.');
      setResult(null); // Hide any old results
      return;
    }
    setError('');

    // Session math
    const sessionData = calculateFootprint(mins, resolution, device, region, customBitrate);

    // Calculate how many times per year based on user selection
    const timesPerYear = period === 'Daily' ? (frequency * 365) : (frequency * 52);
    const yearlyKg = (sessionData.total * timesPerYear) / 1000;

    const benchmarks = RESOLUTION_PROFILES.map(profile => {
      // 1. Calculate the carbon footprint for this specific resolution profile option
      const alternativeData = calculateFootprint(mins, profile.value, device, region);
      
      // 2. Scale it to a yearly value
      const yearly = (alternativeData.total * timesPerYear) / 1000;
      
      // Compute percentage savings relative to the active selection
      const savedPercent = yearlyKg > 0 ? ((yearlyKg - yearly) / yearlyKg * 100).toFixed(0) : 0;
      
      // Return an object matching the exactly defined options
      return { 
        id: profile.value,        // e.g., '360p', '480p'
        name: profile.label,      // e.g., '360p (Low Quality)', '480p (Standard Definition)'
        yearly: yearly,
        savedPercent: savedPercent,
        isCurrent: resolution === profile.value 
      };
    });

    // Update state to trigger subcomponents
    setResult(sessionData);
    setBenchmark(benchmarks);
    setProjection({
      yearly: yearlyKg.toFixed(2),
      monthly: (yearlyKg * 1000 / 12).toFixed(2), // * 1000
      km: (yearlyKg / 0.12).toFixed(1),
      trees: (yearlyKg / 21).toFixed(2)
    });

    setTimeout(() => {
      fetchRecentLogs();
    }, 1000);
  };

  const handleReset = () => {
    setResult(null);
    setProjection(null);
    setMins(0);
    setVideoUrl('');
    setCustomBitrate(null);
    setFrequency(1);
    setRegion('Peninsular Malaysia');
    setResolution('360p');
    setVideoTitle('');
    setDevice('Smartphone');
  };

  // Logic to generate chart data for the sidebar
  const chartData = result ? {
    labels: ['Data Center', 'Network', 'Device'],
    datasets: [{
      data: [result.breakdown.dc, result.breakdown.net, result.breakdown.device],
      backgroundColor: ['#3b82f6', '#a855f7', '#f97316'],
      borderWidth: 0,
    }],
  } : null;

  return (
    <div style={{ color: '#1e293b' }} className="py-12 px-6 max-w-full m-10 space-y-12">

      {/* TIER 1: The Input and the Gauge */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            <CalculatorForm 
            videoUrl={videoUrl} setVideoUrl={setVideoUrl}
            onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing}
            region={region} setRegion={setRegion}
            mins={mins} setMins={setMins}
            error={error}
            resolution={resolution} setResolution={setResolution}
            device={device} setDevice={setDevice}
            onReset={handleReset} onCalculate={handleCalculate}
            frequency={frequency} setFrequency={setFrequency}
            period={period} setPeriod={setPeriod}
            videoTitle={videoTitle} setCustomBitrate={setCustomBitrate}
          />

          <EmissionBreak result={result} chartData={chartData}/>
        </div>

        {/* TIER 2: The Detailed Analysis (Only visible after calculation) */}
        {result && projection && benchmarkData.length > 0 && (
          <div className="space-y-12">
        
            <div className="grid lg:grid-cols-2 gap-8">
              <ImpactDashboard projection={projection} />
              <BenchmarkCompare
                benchmarkData={benchmarkData}
                currentYearly={parseFloat(projection.yearly)} 
              />
            </div>
        
            {/* TIER 3: Device Comparison (The Third Row) */}
            <div className="w-full">
              <DeviceComparison
                mins={mins}
                resolution={resolution}
                region={region}
                currentDevice={device}
                calculateFootprint={calculateFootprint}
              />
            </div>
          </div>
        )}
      
      {result && (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 border-t pt-6 border-slate-100">
          <button
            onClick={handleReset}
            className="flex-1 py-4 px-6 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all uppercase text-sm tracking-wider"
          >
            Reset Calculator
          </button>
    
          <button
            onClick={() => {
              const deviceComp = DEVICE_PROFILES.map(d => ({
                name: d.name,
                total: calculateFootprint(mins, resolution, d.name, region, customBitrate).total
              }));

              // This triggers the generator with all required data
              generateCarbonReport(
                result, projection, 
                { videoTitle, region, resolution, device, mins }, 
                benchmarkData, deviceComp     // Used for Section 3
              );
            }}
            className="flex-1 py-4 px-6 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 transition-all uppercase text-sm tracking-wider"
          >
            Save as PDF Report
          </button>
        </div>
      )}

      <div className="w-full bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-left space-y-4 mt-12">
        <div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            Live Regional Calculation Stream
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Real-time tracking of calculation parameters logged to cloud database metrics.
          </p>
        </div>

        <div className="w-full h-px bg-slate-50"></div>

        {isLogsLoading ? (
          <div className="h-20 bg-slate-50 rounded-xl animate-pulse"></div>
        ) : (
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {recentAudits.length === 0 ? (
              <p className="text-xs font-bold text-slate-400 text-center py-4">No recent activity detected on cloud cluster engine.</p>
            ) : (
              recentAudits.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between text-xs py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-bold text-slate-700">Digital Carbon Assessment Executed</span>
                  </div>
                  <div className="flex items-center space-x-4 font-bold">
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100/50">
                      {audit.region}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {new Date(audit.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;
