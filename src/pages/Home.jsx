import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

function Home() {
  return (
    <div className="h-[85vh] flex flex-col justify-center items-center text-center px-4">
      {/* <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold mb-6 flex items-center gap-2">
        <Leaf size={14} /> FYP 2026: DIGITAL CARBON TRACKER
      </div> */}
        <h1 className="text-6xl font-black text-slate-900 mb-6 leading-tight">
            Your Streaming has a <br /><span className="text-green-600">Carbon Cost.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mb-10">
            Quantify the energy consumption and CO2e emissions of your video habits 
            using localized Malaysian regional grid data.
        </p>
        <Link to="/calculator" 
        className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-green-600 transition-all flex items-center gap-2 shadow-xl"
        > Launch Calculator <ArrowRight size={20} />
        </Link>
        <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-2xl mx-auto px-4 py-8">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-semibold text-slate-700">100% Free</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-semibold text-slate-700">No Login Required</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-semibold text-slate-700">Instant Results</span>
            </div>
        </div>
    </div>
  );
}

export default Home;