import { Outlet, Link, useLocation } from 'react-router-dom';
import logo from '../assets/LOUD NAV.svg'; // Tu logo se mantiene

const NavItem = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="relative group">
      {/* Contenedor del Botón (Píldora) */}
      <div className={`
        px-6 py-2 rounded-full transition-all duration-300 ease-out border
        ${isActive 
          ? 'bg-kinetic border-kinetic shadow-lg shadow-kinetic/20 translate-y-0' 
          : 'bg-transparent border-transparent hover:bg-black/5 hover:-translate-y-0.5'
        }
      `}>
        {/* Texto con Nueva Tipografía (Display) */}
        <span className={`
          font-display text-sm font-bold tracking-tight transition-colors duration-300
          ${isActive ? 'text-white' : 'text-ash group-hover:text-black'}
        `}>
          {label}
        </span>
      </div>
    </Link>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-void text-ash selection:bg-kinetic selection:text-white">
      
      {/* NAVBAR FLOTANTE (Dynamic Island Style) */}
      {/* Quitamos el borde inferior de toda la barra para que se sienta más abierto */}
      <nav className="fixed w-full z-50 top-0 pt-6 px-4 pointer-events-none"> 
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* LOGO (Izquierda) - Pointer events auto para poder clickear */}
            <Link to="/" className="pointer-events-auto group relative">
              {/* Efecto de brillo detrás del logo */}
              <div className="absolute inset-0 bg-white/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              <img 
                src={logo} 
                alt="LOUD Logo" 
                className="h-10 w-auto object-contain relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>

            {/* CÁPSULA DE NAVEGACIÓN (Centro/Derecha) */}
            <div className="hidden md:flex pointer-events-auto">
              {/* Esta es la "Isla" blanca flotante */}
              <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <NavItem to="/" label="Escalas" />
                <NavItem to="/armonizacion" label="Armonización" />
                <NavItem to="/transposicion" label="Transposición" />
              </div>
            </div>
            
            {/* MENÚ MÓVIL (Derecha) */}
            <div className="md:hidden pointer-events-auto">
               <button className="bg-white/80 backdrop-blur-md p-3 rounded-full border border-black/5 shadow-sm text-ash focus:outline-none hover:scale-105 transition-transform">
                  <div className="flex flex-col gap-1.5 items-end">
                    <div className="w-6 h-0.5 bg-ash rounded-full"></div>
                    <div className="w-4 h-0.5 bg-ash rounded-full"></div>
                  </div>
               </button>
            </div>

        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      {/* Aumentamos el padding-top (pt-32) porque el nav ahora flota más abajo visualmente */}
      <main className="flex-grow pt-32 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-black/5 py-12 mt-auto bg-void relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
           
           <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-kinetic rounded-full animate-pulse"></div>
             <span className="font-display font-bold text-xs uppercase tracking-widest text-ash">
               LOUD
             </span>
           </div>

           <div className="flex gap-8">
             <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-ash hover:text-kinetic transition-colors">Github</a>
             <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-ash hover:text-kinetic transition-colors">Docs</a>
             <span className="font-mono text-[10px] uppercase tracking-widest text-ash/50 cursor-default">
               Bytherusso
             </span>
           </div>

        </div>
      </footer>
    </div>
  );
};

export default MainLayout;