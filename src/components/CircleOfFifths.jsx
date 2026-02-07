import React from 'react';
import { Note } from '@tonaljs/tonal';
import { motion } from 'framer-motion';

// Definimos el orden exacto del círculo (por quintas)
const FIFTHS_ORDER = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

const CircleOfFifths = ({ currentRoot, onRootChange }) => {
  const size = 320;
  const center = size / 2;
  const radius = 120;

  // Encontramos el índice de la nota seleccionada para calcular la rotación
  // Normalizamos para manejar enarmonía (Gb = F#)
  const normalizedRoot = Note.simplify(currentRoot);
  const selectedIndex = FIFTHS_ORDER.findIndex(n => 
    Note.chroma(n) === Note.chroma(normalizedRoot)
  );
  
  // Si no encuentra la nota (ej: escalas exóticas), no rota
  const safeIndex = selectedIndex === -1 ? 0 : selectedIndex;

  // Calculamos el ángulo para que la seleccionada quede arriba (-90 grados es las 12 en punto en SVG)
  // Cada paso son 30 grados (360 / 12)
  const rotationAngle = -safeIndex * 30;

  return (
    <div className="relative flex flex-col items-center justify-center">
       
      {/* Contenedor SVG Rotativo */}
      <motion.svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        className="overflow-visible"
        animate={{ rotate: rotationAngle }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }} // Física suave
      >
        {/* Líneas conectoras sutiles */}
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#000" strokeWidth="1" opacity="0.1" strokeDasharray="4 4" />

        {FIFTHS_ORDER.map((note, i) => {
          // Posición matemática en el círculo
          // Empezamos en -90deg para que el índice 0 (C) esté arriba
          const angleDeg = (i * 30) - 90;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = center + radius * Math.cos(angleRad);
          const y = center + radius * Math.sin(angleRad);

          // Estado de la nota
          const isSelected = Note.chroma(note) === Note.chroma(normalizedRoot);
          
          // Vecinos (Dominante / Subdominante)
          // Calculamos distancia circular
          let distance = Math.abs(safeIndex - i);
          if (distance > 6) distance = 12 - distance;
          const isNeighbor = distance === 1;

          return (
            <motion.g 
              key={note}
              onClick={() => onRootChange(note)}
              className="cursor-pointer"
              // Contra-rotamos los textos para que siempre se lean rectos aunque el círculo gire
              initial={false}
              animate={{ rotate: -rotationAngle }}
              style={{ transformOrigin: `${x}px ${y}px` }} 
            >
              {/* Círculo de fondo */}
              <circle 
                cx={x} cy={y} r={isSelected ? 28 : 18} 
                className={`transition-all duration-300 ${
                  isSelected ? 'fill-kinetic stroke-none' : 
                  isNeighbor ? 'fill-white stroke-black/20 hover:stroke-kinetic' : 
                  'fill-void stroke-transparent hover:fill-black/5'
                }`}
              />

              {/* Texto de la Nota */}
              <text 
                x={x} y={y} dy="1"
                textAnchor="middle" alignmentBaseline="middle" 
                className={`font-display font-bold transition-colors select-none ${
                   isSelected ? 'fill-white text-xl' : 
                   isNeighbor ? 'fill-ash text-sm' : 
                   'fill-ash-dim text-xs'
                }`}
              >
                {note}
              </text>
              
              {/* Etiqueta de función (Solo para seleccionada y vecinos) */}
              {isSelected && <text x={x} y={y + 38} textAnchor="middle" className="font-mono text-[8px] fill-kinetic uppercase tracking-widest">Tónica</text>}
              {isNeighbor && i === (safeIndex + 1) % 12 && <text x={x} y={y + 28} textAnchor="middle" className="font-mono text-[6px] fill-ash-dim uppercase">Dom</text>}
              {isNeighbor && i === (safeIndex - 1 + 12) % 12 && <text x={x} y={y + 28} textAnchor="middle" className="font-mono text-[6px] fill-ash-dim uppercase">Sub</text>}

            </motion.g>
          );
        })}
      </motion.svg>

      {/* Centro Estático (No rota) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
         <div className="w-px h-12 bg-black/10 mx-auto mb-2"></div>
         <span className="font-mono text-[9px] text-ash-dim uppercase tracking-[0.2em] bg-void px-2">Quintas</span>
      </div>

    </div>
  );
};

export default CircleOfFifths;