import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NoteSelector = ({ options, value, onChange }) => {
  // Encontrar índice actual
  const currentIndex = options.findIndex(opt => opt.value === value);

  // Función para cambiar nota de forma segura
  const handleSelect = (newIndex) => {
    if (newIndex >= 0 && newIndex < options.length) {
      onChange(options[newIndex].value);
    }
  };

  // Obtenemos una "ventana" de notas para mostrar (2 atrás, actual, 2 adelante)
  // Esto crea el efecto de "cinta" pero controlada
  const visibleRange = [-2, -1, 0, 1, 2];

  return (
    <div className="w-full h-40 bg-void-light/50 border-y border-black/5 flex flex-col items-center justify-center relative overflow-hidden select-none">
      
      {/* LÍNEA DE PRECISIÓN (El Fiel) */}
      <div className="absolute top-0 bottom-0 w-px bg-kinetic/30 z-0"></div>
      <div className="absolute top-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-kinetic z-20"></div>

      {/* CONTENEDOR DE NOTAS */}
      <div className="relative flex items-center justify-center gap-4 md:gap-8 w-full z-10">
        <AnimatePresence mode='popLayout'>
          {visibleRange.map((offset) => {
            const targetIndex = currentIndex + offset;
            const option = options[targetIndex];

            // Si el índice se sale del array, no renderizamos nada (o renderizamos placeholder invisible)
            if (!option) return <div key={`empty-${offset}`} className="w-16 md:w-24" />;

            const isCenter = offset === 0;

            return (
              <motion.button
                key={option.value}
                layout // ESTO ES LA MAGIA: Anima el movimiento automáticamente
                onClick={() => handleSelect(targetIndex)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isCenter ? 1 : 0.3, 
                  scale: isCenter ? 1.2 : 0.9,
                  x: 0 // Mantenemos posición relativa, el layout hace el resto
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`
                  relative flex flex-col items-center justify-center w-16 md:w-24 h-24 rounded-lg transition-colors
                  ${isCenter ? 'cursor-default' : 'cursor-pointer hover:bg-black/5'}
                `}
              >
                {/* Nota */}
                <span className={`font-display text-3xl md:text-5xl tracking-tighter ${isCenter ? 'text-kinetic' : 'text-ash'}`}>
                  {option.label.replace(/\d/, '')}
                </span>
                
                {/* Octava */}
                <span className={`font-mono text-xs font-bold mt-1 ${isCenter ? 'text-kinetic' : 'text-ash-dim'}`}>
                  {option.label.match(/\d/)}
                </span>

                {/* Indicador de Click (Solo en vecinos) */}
                {!isCenter && (
                   <span className="absolute bottom-2 text-[8px] uppercase tracking-widest text-ash/20 opacity-0 hover:opacity-100 transition-opacity">
                      Click
                   </span>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* CONTROLES TÁCTILES (FLECHAS) */}
      <div className="absolute bottom-3 flex gap-8 z-20">
         <button 
           onClick={() => handleSelect(currentIndex - 1)}
           disabled={currentIndex === 0}
           className="p-2 text-ash/30 hover:text-kinetic disabled:opacity-10 transition-colors"
         >
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M15 18L9 12L15 6" />
           </svg>
         </button>
         
         <div className="w-px h-6 bg-black/5"></div>

         <button 
           onClick={() => handleSelect(currentIndex + 1)}
           disabled={currentIndex === options.length - 1}
           className="p-2 text-ash/30 hover:text-kinetic disabled:opacity-10 transition-colors"
         >
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M9 18L15 12L9 6" />
           </svg>
         </button>
      </div>

    </div>
  );
};

export default NoteSelector;