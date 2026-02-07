import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useAnimation } from 'framer-motion';

const NoteTape = ({ options, value, onChange }) => {
  const containerRef = useRef(null);
  const ITEM_WIDTH = 80; // Ancho fijo de cada nota en px
  
  // Encontramos el índice actual (Fuente de la verdad)
  const selectedIndex = options.findIndex(opt => opt.value === value);
  
  // Posición objetivo (Centrar la nota seleccionada)
  // Negativo porque movemos la cinta a la izquierda
  const targetX = -selectedIndex * ITEM_WIDTH;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-36 overflow-hidden flex items-center justify-center bg-void-light/50 border-y border-black/5 select-none touch-pan-y cursor-grab active:cursor-grabbing"
    >
      
      {/* 1. AGUJA CENTRAL (El Fiel) */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-kinetic/50 z-20 transform -translate-x-1/2"></div>
      <div className="absolute left-1/2 top-2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-kinetic z-20"></div>
      
      {/* Indicador de "Centro" abajo también */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-1 h-1 rounded-full bg-kinetic z-20"></div>

      {/* 2. MÁSCARA (Más suave para que se lean las notas de los lados) */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-void via-transparent to-void"></div>

      {/* 3. CINTA DE NOTAS */}
      <motion.div 
        className="flex items-center pl-[50%] pr-[50%]" // Centrado CSS
        animate={{ x: targetX }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="x"
        dragConstraints={{ left: targetX, right: targetX }} // "Elasticidad"
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          // Lógica de "Snap" Inteligente
          // Calculamos cuántos items nos movimos basándonos en los píxeles arrastrados
          const movedItems = Math.round(offset.x / ITEM_WIDTH);
          
          // Invertimos el signo (arrastrar a derecha = índice anterior)
          const targetIndex = selectedIndex - movedItems;
          
          // Aseguramos que el índice exista (Clamp)
          const clampedIndex = Math.max(0, Math.min(targetIndex, options.length - 1));
          
          // Actualizamos el estado "padre"
          if (clampedIndex !== selectedIndex) {
            onChange(options[clampedIndex].value);
          }
        }}
      >
        {options.map((option, index) => {
          const isSelected = index === selectedIndex;
          const distance = Math.abs(index - selectedIndex);
          
          // VISIBILIDAD MEJORADA
          // Opacidad mínima 0.4 para que siempre sean legibles
          const opacity = isSelected ? 1 : Math.max(0.4, 1 - distance * 0.2);
          
          // Escala: La seleccionada crece, las otras se mantienen decentes
          const scale = isSelected ? 1.4 : Math.max(0.8, 1 - distance * 0.1);
          
          // Color: Rojo Kinetic si está seleccionada, Gris Ash si no
          const colorClass = isSelected ? 'text-kinetic' : 'text-ash/60';

          return (
            <motion.div
              key={option.value}
              onClick={() => onChange(option.value)} // Click para seleccionar directo
              className="flex-shrink-0 flex flex-col items-center justify-center relative h-full py-4"
              style={{ width: ITEM_WIDTH }}
              animate={{ 
                scale: scale,
                opacity: opacity,
                y: isSelected ? 0 : 4 // Efecto "Montaña": la del centro sube un poco visualmente (relativo)
              }}
            >
              {/* Nota Grande */}
              <span className={`font-display text-3xl md:text-4xl tracking-tighter transition-colors duration-200 ${colorClass}`}>
                {option.label.replace(/\d/, '')} 
              </span>
              
              {/* Octava */}
              <span className={`font-mono text-xs mt-1 font-bold ${isSelected ? 'text-kinetic' : 'text-ash-dim'}`}>
                {option.label.match(/\d/)} 
              </span>

              {/* Regla Milimétrica (Decoración) */}
              <div className="absolute bottom-0 w-full flex justify-center">
                 <div className={`w-px h-3 transition-colors ${isSelected ? 'bg-kinetic' : 'bg-black/10'}`}></div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default NoteTape;