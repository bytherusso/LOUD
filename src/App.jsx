import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Importamos las páginas que acabamos de crear
import ScalesPage from './pages/ScalesPage';
import HarmonizationPage from './pages/HarmonizationPage';
import TranspositionPage from './pages/TranspositionPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<ScalesPage />} />
        <Route path="armonizacion" element={<HarmonizationPage />} />
        <Route path="transposicion" element={<TranspositionPage />} />
        
        {/* Página 404 Estilo Streetwear */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <h1 className="text-9xl font-black text-street-border">404</h1>
            <p className="text-2xl text-street-accent uppercase font-bold tracking-widest">Nota no encontrada</p>
          </div>
        } />
      </Route>
    </Routes>
  );
}

export default App;