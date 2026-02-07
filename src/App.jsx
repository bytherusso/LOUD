import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Componentes UI Globales
import CustomCursor from './components/ui/CustomCursor';

// Páginas
import ScalesPage from './pages/ScalesPage';
import HarmonizationPage from './pages/HarmonizationPage';
import TranspositionPage from './pages/TranspositionPage';

function App() {
  return (
    // Usamos un Fragmento (<>...</>) en lugar de Lenis para evitar el error
    <>
      
      {/* Cursor Personalizado (Punto Rojo) */}
      <CustomCursor />
      
      {/* Capa de Ruido (Film Grain) Global */}
      <div className="noise-overlay"></div>

      {/* Sistema de Rutas */}
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ScalesPage />} />
          <Route path="armonizacion" element={<HarmonizationPage />} />
          <Route path="transposicion" element={<TranspositionPage />} />
          
          {/* Página 404 Estilo Swiss */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
              <h1 className="text-[10rem] font-display leading-none text-ash opacity-10">404</h1>
              <div className="absolute">
                 <p className="text-2xl font-mono text-kinetic uppercase tracking-widest bg-kinetic/10 px-4 py-2">
                    Nota Fuera de Rango
                 </p>
              </div>
            </div>
          } />
        </Route>
      </Routes>
      
    </>
  );
}

export default App;