// src/pages/HowItWorks.jsx
import React from 'react';
import { Server, Share2, Laptop } from 'lucide-react';

function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">Scientific Methodology</h1>
      <p className="text-slate-600 mb-12 text-lg">
        This calculator employs a "Bottom-Up" energy intensity model to quantify the 
        environmental impact of digital services.
      </p>

      <div className="bg-slate-900 text-green-400 p-8 rounded-2xl font-mono text-xl mb-12 text-center">
        Total CO2e = (E<sub>dc</sub> + E<sub>net</sub> + E<sub>device</sub>) × EF<sub>grid</sub>
      </div>

      <div className="space-y-8">
        <div className="flex gap-6 p-6 bg-white rounded-2xl border border-slate-100">
          <Server className="text-blue-500 shrink-0" size={32} />
          <div>
            <h3 className="font-bold text-lg">E<sub>dc</sub> (Data Center)</h3>
            <p className="text-slate-500">Processing and storage energy on the server-side. Calculated at X kWh per GB transferred.</p>
          </div>
        </div>
        <div className="flex gap-6 p-6 bg-white rounded-2xl border border-slate-100">
          <Share2 className="text-purple-500 shrink-0" size={32} />
          <div>
            <h3 className="font-bold text-lg">E<sub>net</sub> (Network Transmission)</h3>
            <p className="text-slate-500">Energy used by global infrastructure (fiber, routers) to move data. Calculated at Y kWh/GB.</p>
          </div>
        </div>
        <div className="flex gap-6 p-6 bg-white rounded-2xl border border-slate-100">
          <Laptop className="text-orange-500 shrink-0" size={32} />
          <div>
            <h3 className="font-bold text-lg">E<sub>device</sub> (End-user Device)</h3>
            <p className="text-slate-500">Power consumed by your specific device based on wattage and duration (Watts/1000 × Hours).</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;