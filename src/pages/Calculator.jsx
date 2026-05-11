import React, { useState } from 'react'; //useRef
import { calculateFootprint, REGION_FACTORS } from '../utils/carbonLogic';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// Import your new subcomponents
import { CalculatorForm } from '../components/CalculatorForm';
import { EmissionBreak } from '../components/EmissionBreak';
import { ImpactDashboard } from '../components/ImpactDashboard';
import { BenchmarkCompare } from '../components/BenchmarkCompare';
// import { CarbonReport } from '../components/CarbonReport';

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

  // 2. The Main Action Handler
  const handleCalculate = () => {
    if (!mins || mins <= 0) {
      setError('Please input streaming minutes to see your impact.');
      setResult(null); // Hide any old results
      return;
    }
    setError('');

    // Session math
    const sessionData = calculateFootprint(mins, resolution, device, region);
    
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

  // const generatePDF = async () => {
  //   const element = reportRef.current;
  //   if (!element) return;

  //   const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  //   const imgData = canvas.toDataURL('image/png');
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //   pdf.save(`Carbon_Report_${region}.pdf`);
  // };

  const handleReset = () => {
    setResult(null);
    setProjection(null);
    setMins(0);
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
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-12">
      {/* Hidden Template for PDF
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <CarbonReport 
          ref={reportRef} 
          result={result} 
          projection={projection} 
          region={region} 
        />
      </div> */}

      {/* TIER 1: The Input and the Gauge */}
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        <CalculatorForm 
          region={region} setRegion={setRegion}
          mins={mins} setMins={setMins}
          error={error}
          resolution={resolution} setResolution={setResolution}
          device={device} setDevice={setDevice}
          onCalculate={handleCalculate}
          frequency={frequency} setFrequency={setFrequency}
          period={period} setPeriod={setPeriod}
        />
        
        <EmissionBreak result={result} chartData={chartData}/>
      </div>

      {/* TIER 2: The Detailed Analysis (Only visible after calculation) */}
      {result && projection && benchmarkData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          <ImpactDashboard projection={projection} />
          <BenchmarkCompare
            benchmarkData={benchmarkData} 
            currentYearly={parseFloat(projection.yearly)} 
          />
        </div>
      )}

      {result && (
        <div className="flex justify-center">
          {/* <button onClick={generatePDF} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-600 transition-all uppercase tracking-widest">
            Download PDF Report
          </button> */}
          <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 font-bold uppercase text-xs tracking-widest transition-colors">
             Reset All Data
          </button>
        </div>
      )}
    </div>
  );
}

export default Calculator;