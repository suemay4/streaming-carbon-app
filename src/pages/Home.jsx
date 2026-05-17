import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Server, Share2, MonitorSmartphone, HelpCircle, Info } from 'lucide-react';

function Home() {
  return (
    <div className="w-full min-h-screen text-slate-800 antialiased">
      
      {/* =========================================================
          SECTION 1: HERO & CALL TO ACTION (CTA)
          ========================================================= */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-10">
          {/* Hero Headline Copy */}
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Your Streaming Streams Have A <br />
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                Hidden Carbon Cost.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              Discover how your video streaming habits affect the environment using estimated energy use and regional electricity data from Malaysia.
            </p>
          </div>

          {/* Core Action Trigger */}
          <div>
            <Link to="/calculator" 
              className="group bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20 active:scale-[0.98]"
            > 
              Launch Calculator 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 2: KNOWLEDGE GRID (FAQ CORE LEARNING)
          ========================================================= */}
      <section className="w-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 py-16 px-4 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Understanding Digital Carbon Footprints
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Question 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm space-y-2.5">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-emerald-500 rounded-full block"></span>
                What is a digital carbon footprint?
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Whenever you search the web, stream media, or check emails, your request is processed by remote computing power. 
                A digital carbon footprint measures the greenhouse gas emissions (CO₂e) produced from the energy needed to support these digital activities.
              </p>
            </div>

            {/* Question 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm space-y-2.5">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-500 rounded-full block"></span>
                How does video streaming generate carbon?
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Video files are large data packages. When you press play, cloud servers process and send the video through internet networks to your device.
                Along the way, data moves through multiple systems like servers, routers, and local power grids that supply electricity to each part of the network.
                Every stage uses energy, which can lead to carbon emissions depending on how that electricity is generated.
              </p>
            </div>

            {/* Question 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm space-y-2.5">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-500 rounded-full block"></span>
                What is a Grid Emission Factor?
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                A grid emission factor shows how much carbon dioxide (CO₂) is produced for every unit of electricity used, 
                typically measured in tonnes of CO₂ equivalent per megawatt-hour (tCO₂e/MWh).
              </p>
            </div>

            {/* Question 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm space-y-2.5">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-orange-500 rounded-full block"></span>
                Why isn’t digital carbon the same everywhere?
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Carbon emissions aren't the same everywhere because electricity is generated in different ways around the world. 
                Electricity from coal produces more emissions than electricity from renewable sources like solar or hydro. 
                This is why same activity can have a different carbon impact depending on the local power grid.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 3: THREE-LAYER COMPUTATIONAL ARCHITECTURE
          ========================================================= */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Where Do Your Streaming Emissions Actually Come From?
            </h2>
          </div>
        
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Layer 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 text-left shadow-sm">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-max"><Server size={20} /></div>
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Layer 1</h4>
                <p className="text-base font-bold text-slate-800 mt-0.5">Data Center Processing</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Energy is used in large data centers that store and process video content when you press play.
                </p>
              </div>
            </div>
            
            {/* Layer 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 text-left shadow-sm">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-max"><Share2 size={20} /></div>
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Layer 2</h4>
                <p className="text-base font-bold text-slate-800 mt-0.5">Network Transmission Path</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Electricity is used as data travels through internet networks, including cables, routers, and service providers that move the video to your device.
                </p>
              </div>
            </div>
            
            {/* Layer 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 text-left shadow-sm">
              <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl w-max"><MonitorSmartphone size={20} /></div>
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Layer 3</h4>
                <p className="text-base font-bold text-slate-800 mt-0.5">End-User Device</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Your device also uses energy to receive, decode, and display the video on your screen.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 4: WHY DIGITAL SUSTAINABILITY MATTERS
          ========================================================= */}
      <section className="w-full bg-gradient-to-r from-emerald-50/80 via-slate-50 to-teal-50/80 py-16 px-4 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-5 space-y-3 text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Why Digital Sustainability Matters
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Unlike plastic bags or tailpipe exhaust, digital carbon footprints are entirely invisible. 
              Because we can’t see them, it’s easy to overlook the energy used by internet infrastructure and the emissions it can produce.
            </p>
          </div>
          
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
              <h4 className="font-bold text-sm text-slate-800">The Growth of Digital Energy Use</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Digital services like cloud computing, streaming, and data storage are growing quickly and are now part of everyday life.
                As usage grows, so does the energy needed to run servers, networks, and devices, which raises the environmental footprint.
              </p>
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
              <h4 className="font-bold text-sm text-slate-800">Reducing Digital Energy Use</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Digital energy use is shaped by both the technology and how we use them. 
                Efficient systems use less power, and heavier usage increases energy demand.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 5: TRUSTED SCIENTIFIC MODELS (CITATIONS)
          ========================================================= */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Built on Verified Scientific Models
            </h2>
            <p className="text-base text-slate-500 leading-relaxed font-medium max-w-3xl mx-auto">
              The calculations are based on peer-reviewed research, industry standards, and official regional electricity statistics. 
              This helps ensure the results are consistent with widely accepted environmental assessment methods.
            </p>
          </div>

          {/* Mini Citation Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-left">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 font-medium space-y-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                Suruhanjaya Tenaga (Energy Commission of Malaysia)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provides regional electricity grid emission factors used to estimate carbon impact.
              </p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 font-medium space-y-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 block"></span>
                International Energy Agency (IEA) Benchmarks
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provides global energy and emissions benchmarks used to standardize carbon impact estimates.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 6: TRUST ASSURANCE FOOTER FOOTNOTE
          ========================================================= */}
      <section className="w-full py-10 px-4 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 text-xs font-semibold">
          <div className="inline-flex items-center gap-2 text-slate-300">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Open Source Methodology</span>
          </div>
          <div className="inline-flex items-center gap-2 text-slate-300">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>No Session Cookies/Login</span>
          </div>
          <div className="inline-flex items-center gap-2 text-slate-300">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Real-time YouTube Scrapes</span>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;