import { useState, useEffect } from 'react';
import { CircleUserIcon } from 'lucide-react';

export function VisitorCounterCard() {
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual live backend address from Render
    fetch('https://streaming-carbon-app-backend.onrender.com/api/analytics/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setTotalViews(data.totalViews || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Unable to fetch platform landing count:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 animate-pulse w-full max-w-xs mx-auto">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
      <div className="flex items-center space-x-4 shrink-0">
        
        <div className="w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] shrink-0">
          <CircleUserIcon size={26} strokeWidth={2.5} />
        </div>

        {/* Counter Numbers & Subtitles Layout */}
        <div className="flex flex-col">
          <span className="text-4xl font-extrabold text-[#00A86B] tracking-tight leading-none">
            {totalViews.toLocaleString()}
          </span>
          <span className="text-[13px] font-bold text-slate-500 tracking-tight mt-1 leading-tight">
            Malaysians <br />
            landed on <span className="text-[#00A86B] font-extrabold">BitLeaf</span>
          </span>
        </div>

      </div>

      {/* Center Vertical Divider Line Element */}
      <div className="hidden sm:block w-px bg-slate-100 h-10 self-center"></div>

      {/* Right Panel: Content Notice & Heart Asset Icon Layout */}
      <div className="flex-1 text-center sm:text-left">
        <h4 className="text-[14px] font-bold text-slate-800 tracking-tight leading-snug">
          Thank you for being part of the change!
        </h4>
        <div className="flex items-center justify-center sm:justify-start space-x-1 mt-0.5 text-[12px] font-semibold text-slate-400">
          <span>Every visitor helps build a more sustainable future.</span>
          <span className="text-emerald-400 text-xs shrink-0 animate-pulse">💚</span>
        </div>
      </div>
    </div>
  );
}