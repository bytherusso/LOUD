import { Outlet, Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`
      uppercase font-bold tracking-wider px-4 py-2 border-2 transition-all duration-200
      ${isActive 
        ? 'bg-street-accent text-street-dark border-street-accent shadow-hard-sm -translate-y-1' 
        : 'border-transparent text-street-muted hover:text-street-text hover:border-street-muted'}
    `}>
      {label}
    </Link>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b-2 border-street-border bg-street-dark/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="text-3xl font-black uppercase tracking-tighter text-white">
            LOUD
            </Link>
            <div className="hidden md:flex space-x-4">
              <NavItem to="/" label="Escalas" />
              <NavItem to="/armonizacion" label="Armonización" />
              <NavItem to="/transposicion" label="Transposición" />
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;