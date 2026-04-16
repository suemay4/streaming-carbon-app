// import { Link, useLocation } from 'react-router-dom';

// function Navbar() {
//   const location = useLocation();

//   return (
//     <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
//       <Link to="/" className="text-2xl font-black text-green-700 tracking-tighter italic">
//         BITLEAF
//       </Link>
      
//       <div className="flex gap-8 items-center">
//         <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-green-600' : 'text-white'}`}>Home</Link>
//         <Link to="/calculator" className={`text-sm font-medium ${location.pathname === '/calculator' ? 'text-green-600' : 'text-white'}`}>Calculator</Link>
//         <Link to="/how-it-works" className={`text-sm font-medium ${location.pathname === '/how-it-works' ? 'text-green-600' : 'text-white'}`}>Methodology</Link>
        
//         {/* Optional: Highlight the calculator link as a button */}
//         <Link to="/calculator" className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition">
//           Launch App
//         </Link>
//       </div>
//     </nav>
//   );
// }