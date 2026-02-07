import React from 'react';
import { Note, Interval } from '@tonaljs/tonal';
import { motion } from 'framer-motion';

const VALVE_MAP = {
  0: [false, false, false], // Open
  1: [false, true, false],  // 2
  2: [true, false, false],  // 1
  3: [true, true, false],   // 1+2
  4: [false, true, true],   // 2+3
  5: [true, false, true],   // 1+3
  6: [true, true, true],    // 1+2+3
};

const HARMONICS = {
  'Trompeta (Bb)': ['C4', 'G4', 'C5', 'E5', 'G5', 'Bb5', 'C6'],
  'Corno (F)': ['C3', 'G3', 'C4', 'E4', 'G4', 'Bb4', 'C5', 'E5', 'G5'],
};

const BrassVisualizer = ({ note, instrumentName }) => {
  const cleanNote = Note.simplify(note);
  const harmonics = HARMONICS[instrumentName] || HARMONICS['Trompeta (Bb)'];
  
  let targetHarmonic = null;
  let semitonesDown = 0;

  for (let h of harmonics) {
    const dist = Interval.semitones(Interval.distance(cleanNote, h));
    if (dist >= 0 && dist <= 6) {
      targetHarmonic = h;
      semitonesDown = dist;
      break;
    }
  }

  const valves = targetHarmonic ? VALVE_MAP[semitonesDown] : [false, false, false];
  const notFound = !targetHarmonic;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-void border border-white/5 rounded-lg mt-4 w-full">
      <h3 className="font-mono text-[10px] text-ash-dim uppercase tracking-widest mb-4">
        Digitación ({instrumentName})
      </h3>
      
      {notFound ? (
        <div className="text-red-500 font-mono text-xs border border-red-500/20 p-2 bg-red-500/5">
          Nota fuera de rango común
        </div>
      ) : (
        <div className="flex gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <motion.div 
                initial={false}
                animate={{ 
                  backgroundColor: valves[i] ? '#FFB800' : 'transparent',
                  borderColor: valves[i] ? '#FFB800' : '#333',
                  y: valves[i] ? 4 : 0
                }}
                className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg
                  ${valves[i] ? 'shadow-[0_0_15px_rgba(255,184,0,0.4)]' : ''}
                `}
              >
                 {/* Efecto visual de pistón presionado */}
                 <div className={`w-8 h-8 rounded-full ${valves[i] ? 'bg-black/20' : 'bg-white/5'}`}></div>
              </motion.div>
              <span className={`font-mono text-xs font-bold ${valves[i] ? 'text-kinetic' : 'text-ash-dim'}`}>
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-2">
         <span className="w-2 h-2 rounded-full bg-kinetic animate-pulse"></span>
         <p className="font-mono text-xs text-ash">
            {semitonesDown === 0 
              ? "Al aire (Sin pistones)" 
              : `Baja ${semitonesDown} semitonos`}
         </p>
      </div>
    </div>
  );
};

export default BrassVisualizer;