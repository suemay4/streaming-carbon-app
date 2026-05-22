import React from 'react';
import { Server, Share2, Laptop, Globe, Info, BookOpen, Layers, BarChart3, HelpCircle } from 'lucide-react';

function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 space-y-16">
      {/* OVERVIEW */}
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">How This Calculator Works</h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          Watching videos online uses electricity across data centers, internet networks, and your device.
          This calculator estimates the carbon emissions produced during streaming based on:
        </p>
        <ul className="list-disc pl-6 text-slate-600 text-lg space-y-1">
          <li>How long you stream</li>
          <li>Video quality</li>
          <li>Your device type</li>
          <li>Your region’s electricity grid</li>
        </ul>
        <p className="text-lg text-slate-600 leading-relaxed">
          We estimate how much electricity is used during streaming, then multiply it by
          how much CO₂ your local electricity grid produces:
        </p>
        <div className="bg-slate-900 text-emerald-400 p-8 rounded-3xl font-mono text-center shadow-xl shadow-slate-100 relative overflow-hidden">
          <div className="text-xl md:text-2xl font-bold text-white">
          Carbon Emissions = Electricity Used × Grid Emission Factor
          </div>
        </div>
        <details className="mt-4 text-left text-xl text-slate-500">
          <summary className="cursor-pointer">Show technical formula</summary>
            <div className="bg-slate-900 text-emerald-400 p-8 rounded-3xl font-mono text-center shadow-xl shadow-slate-100 relative overflow-hidden">
              <div className="text-xl md:text-2xl font-bold text-white tracking-wide">
                Total CO₂e = (E<sub>dc</sub> + E<sub>net</sub> + E<sub>device</sub>) × EF<sub>grid</sub>
              </div>
          </div>
        </details>
      </div>

      {/* 3. THREE-LAYER */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers className="text-emerald-500" size={22} />
          Where Streaming Uses Electricity
        </h2>
        
        <div className="space-y-4">
          {/* Data Centre */}
          <div className="flex flex-col md:flex-row gap-5 p-6 bg-white rounded-2xl border border-slate-100 transition-all">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl self-start">
              <Server size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-lg">E<sub>dc</sub> (Data Centre Infrastructure Layer)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Data centers store and deliver the videos you watch. They use electricity for servers, cooling systems, and storage.
                <span className="font-semibold text-slate-900 mx-1">0.0015 kWh/GB</span>transferred based on global cloud efficiency indexes.
              </p>
              <div className="text-xs font-mono text-blue-700 bg-blue-50/50 p-2 rounded-md w-max">
                Formula: Data Transferred (GB) × 0.015 kWh/GB
              </div>
            </div>
          </div>

          {/* Network Transmission */}
          <div className="flex flex-col md:flex-row gap-5 p-6 bg-white rounded-2xl border border-slate-100 transition-all">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl self-start">
              <Share2 size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-lg">E<sub>net</sub> (Network Transmission Layer)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Streaming data travels through internet networks, including cables,
                mobile towers, routers, and content delivery systems.
                All of these use electricity.
                It is modeled as a constant of <span className="font-semibold text-slate-900 mx-1">0.0185 kWh/hour</span>.
              </p>
              <div className="text-xs font-mono text-purple-700 bg-purple-50/50 p-2 rounded-md w-max">
                Formula: Data Transferred (GB) × 0.015 kWh/GB
              </div>
            </div>
          </div>

          {/* End-user Device */}
          <div className="flex flex-col md:flex-row gap-5 p-6 bg-white rounded-2xl border border-slate-100 transition-all">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl self-start">
              <Laptop size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-lg">E<sub>device</sub> (End-User Device Layer)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Your device also consumes electricity while streaming, especially the screen, processor, and wireless connection.
              </p>
              <div className="text-xs font-mono text-orange-700 bg-orange-50/50 p-2 rounded-md w-max">
                Formula: (Device Wattage / 1000) × (Duration in Minutes / 60)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. THE DATA LAYER DERIVATION */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <BarChart3 className="text-emerald-500" size={22} />
          How Video Quality Affects Data Usage
        </h2>
        <p className="text-slate-600 text-xl leading-relaxed">
          Higher video quality uses more internet data, which increases electricity use and carbon emissions.
          We estimate data usage using average streaming bitrates.
        </p>

        <div className="grid md:grid-cols-2 gap-4 bg-slate-50 p-6">
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">Resolution to Data-Volume Rule:</h4>
            <code className="block text-xs bg-white text-slate-700 p-3 rounded-xl border border-slate-200/60 font-mono leading-relaxed">
              Bitrate (Mbps) = Bits per second / 1,000,000 <br />
              Data (GB) = (Bitrate × 60 × Minutes) / (8 × 1024)
            </code>
          </div>
          <div className="overflow-hidden bg-white border border-slate-200/60 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200/60">
                  <th className="p-3">Quality Profile</th>
                  <th className="p-3">Assumed Bitrate</th>
                  <th className="p-3 text-right">Data Rate / Hour</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
                <tr><td className="p-3 font-sans">360p (Low)</td><td className="p-3">4 Mbps</td><td className="p-3 text-right">1.8 GB/h</td></tr>
                <tr><td className="p-3 font-sans">480p (SD)</td><td className="p-3">6 Mbps</td><td className="p-3 text-right">2.7 GB/h</td></tr>
                <tr><td className="p-3 font-sans">1080p (FHD)</td><td className="p-3">12 Mbps</td><td className="p-3 text-right">5.4 GB/h</td></tr>
                <tr><td className="p-3 font-sans">4K (Ultra HD)</td><td className="p-3">35 Mbps</td><td className="p-3 text-right">15.75 GB/h</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. HARDWARE Wattage LOGS */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Laptop className="text-emerald-500" size={22} />
          Estimated Power Use by Device
        </h2>
        <p className="text-slate-600 text-xl leading-relaxed">
          Device electricity use is estimated using average power consumption values for common devices such as smartphones, laptops, tablets, and TVs.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white border border-slate-100 rounded-xl"><div className="text-xs text-slate-500 font-medium">Smartphone</div><div className="text-xl font-mono font-bold text-slate-900 mt-1">3.5W</div></div>
          <div className="p-4 bg-white border border-slate-100 rounded-xl"><div className="text-xs text-slate-500 font-medium">Tablet</div><div className="text-xl font-mono font-bold text-slate-900 mt-1">7.0W</div></div>
          <div className="p-4 bg-white border border-slate-100 rounded-xl"><div className="text-xs text-slate-500 font-medium">Mid-Spec Laptop</div><div className="text-xl font-mono font-bold text-slate-900 mt-1">32.5W</div></div>
          <div className="p-4 bg-white border border-slate-100 rounded-xl"><div className="text-xs text-slate-500 font-medium">Smart TV</div><div className="text-xl font-mono font-bold text-slate-900 mt-1">120.0W</div></div>
        </div>
      </div>

      {/* 6. REGIONAL GRID EMISSION FACTORS */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe className="text-emerald-500" size={22} />
          Regional Grid Localization (EF<sub>grid</sub>)
        </h2>
        <p className="text-slate-600 text-xl leading-relaxed">
          Energy consumption totals are converted into greenhouse gas masses (kg CO₂e/kWh) using official provisional tracking numbers sourced from the{" "}
          <a
            href="https://myenergystats.st.gov.my/documents/d/guest/grid-emission-factor-gef-in-malaysia-2022-2024-provisional-"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-900 hover:underline"
          >
          Energy Commission (Suruhanjaya Tenaga)
          </a>
          :
        </p>

        <div className="overflow-hidden border border-slate-200 rounded-xl bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="p-4">Region / Grid Zone</th>
                <th className="p-4">Emission Factor (kg CO₂e / kWh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-4 font-medium text-center text-slate-900">Peninsular Malaysia</td>
                <td className="p-4 font-mono text-center font-semibold text-slate-900">0.740</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-center text-slate-900">Sabah</td>
                <td className="p-4 font-mono text-center font-semibold text-slate-900">0.539</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-center text-emerald-900">Sarawak</td>
                <td className="p-4 text-center font-mono font-semibold text-emerald-900">0.199</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. PROJECT ASSUMPTIONS & LITERATURE BOUNDARIES */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Info className="text-slate-500" size={20} />
          Important Notes & Assumptions
        </h3>
        <ul className="list-disc pl-5 text-s text-slate-600 space-y-3 leading-relaxed">
          <li>
            <strong className="text-slate-800">Electricity-based estimates only:</strong> This calculator estimates emissions from electricity used during streaming only.
              It does not include emissions from manufacturing devices or data center construction.
          </li>
          <li>
            <strong className="text-slate-800">Network estimates are simplified:</strong> Internet energy use is calculated using global average values per GB of data,
              not exact real-time routing or ISP-specific data.
          </li>
          <li>
            <strong className="text-slate-800">Device usage is estimated:</strong> Power consumption is based on typical device profiles (phone, laptop, TV, etc.)
              and may vary depending on brightness, background apps, and hardware conditions.
          </li>
          <li>
            <strong className="text-slate-800">Results are estimated:</strong> Values are designed for comparison and awareness, not precise scientific measurement.
          </li>
        </ul>
      </div>

      {/* 8. BIBLIOGRAPHIC CITATIONS
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wider text-slate-600">
          <BookOpen size={16} />
          Citations & Baselines
        </h3>
        <ol className="list-decimal pl-5 text-[11px] text-slate-500 space-y-2 font-mono">
          <li>Malaysian Energy Commission (Suruhanjaya Tenaga). Grid Emission Factors for Peninsular Malaysia, Sabah and Sarawak.</li>
          <li>International Energy Agency (IEA). Energy Intensity of Digital Services and Streaming Network Frameworks. Technical Report.</li>
          <li>Aslan, J., Mayers, K., Koomey, J. G., & France, C. Electricity Intensity of Internet Data Transmission: Untangling the Estimates. Journal of Industrial Ecology.</li>
        </ol>
      </div> */}
    </div>
  );
}

export default HowItWorks;
