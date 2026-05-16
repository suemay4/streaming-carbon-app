import React, { useState } from 'react'; //useRef
import { calculateFootprint, REGION_FACTORS, DEVICE_PROFILES } from '../utils/carbonLogic';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image-more';

// Import your new subcomponents
import { CalculatorForm } from '../components/CalculatorForm';
import { EmissionBreak } from '../components/EmissionBreak';
import { ImpactDashboard } from '../components/ImpactDashboard';
import { BenchmarkCompare } from '../components/BenchmarkCompare';
import { generateCarbonReport } from '../utils/pdfGenerator';
import { DeviceComparison } from '../components/DeviceComparison';

function Calculator() {
  // const reportRef = useRef(null);

  // 1. Centralized State
  const [region, setRegion] = useState('Peninsular Malaysia');
  const [device, setDevice] = useState('Laptop');
  const [mins, setMins] = useState(0);
  const [resolution, setResolution] = useState('1080p');
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

  const handleAnalyze = async () => {
    if (!videoUrl) return;
    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      console.log("Backend Data Received:", data) // check f12 for this

      // Auto-update your state variables with real data!
      if (data.durationMins) {
        setVideoTitle(data.title);
        setMins(data.durationMins);
        setCustomBitrate(data.bitrateKbps);
        alert(`Detected: ${data.title}`);
      }
    
      // Logic to match the resolution to your existing dropdown options
      if (data.resolution.includes('2160') || data.resolution.includes('4K')) setResolution('4K');
      else if (data.resolution.includes('1080')) setResolution('1080p');
      else setResolution('720p');
    
      alert(`Successfully analyzed: ${data.title}`);
    } catch (err) {
      alert("Could not analyze link. Please paste a valid public YouTube link.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. The Main Action Handler
  const handleCalculate = () => {
    if (!mins || mins <= 0) {
      setError('Please input streaming minutes to see your impact.');
      setResult(null); // Hide any old results
      return;
    }
    setError('');

    // Session math
    const sessionData = calculateFootprint(mins, resolution, device, region, customBitrate);
    
    // Benchmark math (Comparing to other qualities)
    const scenarios = [
      { id: '360p', name: 'SD (360p)', color: 'bg-emerald-500' },
      { id: '1080p', name: 'HD (1080p)', color: 'bg-blue-500' },
      { id: '4K', name: 'Ultra HD (4K)', color: 'bg-red-500' }
    ];

    // Calculate how many times per year based on user selection
    const timesPerYear = period === 'Daily' ? (frequency * 365) : (frequency * 52);
    const yearlyKg = (sessionData.total * timesPerYear) / 1000;

    const benchmarks = scenarios.map(s => {
      const data = calculateFootprint(mins, s.id, device, region);
      const yearly = (data.total * timesPerYear) / 1000;
      const savedPercent = yearlyKg > 0 ? ((yearlyKg - yearly) / yearlyKg * 100).toFixed(0) : 0;
      return { ...s, yearly, savedPercent, isCurrent: resolution === s.id };
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
  };

  

  /*const handleDownloadPDF = async () => {
    const reportElement = document.getElementById('pdf-report-template');
    if (!reportElement) return;

    alert("Generating clean academic report...");

    try {
      // We capture the HIDDEN template, not the dashboard
      const dataUrl = await domtoimage.toPng(reportElement, {
        width: 800,
        bgcolor: '#ffffff',
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Carbon_Report_${new Date().getTime()}.pdf`);
    
      alert("Report Downloaded Successfully!");
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Could not generate report template.");
    }
  };*/

  const handleReset = () => {
    setResult(null);
    setProjection(null);
    setMins(0);
    setVideoUrl('');
    setCustomBitrate(null);
    setFrequency(1);
    setRegion('Peninsular Malaysia');
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
    <div style={{ backgroundColor: '#ffffff', color: '#1e293b' }} className="py-12 px-6 max-w-7xl mx-auto space-y-12">

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
    </div>
  );
}

export default Calculator;