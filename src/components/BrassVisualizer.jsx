import React from 'react';
import { Note, Interval } from '@tonaljs/tonal';

// Lógica de Pistones:
// 0 = Al aire
// 1 = 1er pistón (-2 semitonos)
// 2 = 2do pistón (-1 semitono)
// 3 = 3er pistón (-3 semitonos)
// Combinaciones: 12 (-3), 23 (-4), 13 (-5), 123 (-6)

const VALVE_MAP = {
  0: [false, false, false], // Open
  1: [false, true, false],  // 2
  2: [true, false, false],  // 1
  3: [true, true, false],   // 1+2
  4: [false, true, true],   // 2+3
  5: [true, false, true],   // 1+3
  6: [true, true, true],    // 1+2+3
};

// Serie armónica aproximada (Notas "al aire" para instrumentos en Bb y F)
// Usamos alturas MIDI aproximadas para calcular la distancia
const HARMONICS = {
  'Trompeta (Bb)': ['C4', 'G4', 'C5', 'E5', 'G5', 'Bb5', 'C6'], // Escrito en C
  'Corno (F)': ['C3', 'G3', 'C4', 'E4', 'G4', 'Bb4', 'C5', 'E5', 'G5'], // Escrito en C
};

const BrassVisualizer = ({ note, instrumentName }) => {
  // 1. Limpiamos la nota (quitamos dobles alteraciones)
  const cleanNote = Note.simplify(note);
  
  // 2. Encontramos el armónico "Al aire" más cercano POR ARRIBA
  // La lógica de los metales es: Buscas el armónico superior y "bajas" usando pistones.
  const harmonics = HARMONICS[instrumentName] || HARMONICS['Trompeta (Bb)'];
  
  let targetHarmonic = null;
  let semitonesDown = 0;

  // Buscamos el armónico base
  for (let h of harmonics) {
    const dist = Interval.semitones(Interval.distance(cleanNote, h));
    if (dist >= 0 && dist <= 6) {
      targetHarmonic = h;
      semitonesDown = dist;
      break;
    }
  }

  // Si no encontramos (nota muy grave o muy aguda fuera de rango), default a todo abierto o cerrado
  const valves = targetHarmonic ? VALVE_MAP[semitonesDown] : [false, false, false];
  const notFound = !targetHarmonic;

  return (
    <div className="flex flex-col items-center bg-street-dark p-6 rounded-xl border border-street-border mt-6">
      <h3 className="text-street-muted text-xs font-black uppercase tracking-widest mb-4">
        Digitación Sugerida ({instrumentName})
      </h3>
      
      {notFound ? (
        <div className="text-red-500 font-bold text-sm">Nota fuera de rango común</div>
      ) : (
        <div className="flex gap-4">
          {/* DIBUJO DE LOS 3 PISTONES */}
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              {/* El Botón (Pistón) */}
              <div 
                className={`
                  w-12 h-12 rounded-full border-4 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]
                  ${valves[i] 
                    ? 'bg-street-accent border-street-accent translate-y-2 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]' // Presionado
                    : 'bg-street-card border-street-muted' // Suelto
                  }
                `}
              ></div>
              <span className="text-street-muted font-bold text-xs">{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-street-text text-sm">
        {semitonesDown === 0 
          ? "Al aire (Sin pistones)" 
          : `Baja ${semitonesDown} semitonos desde ${targetHarmonic}`
        }
      </p>
    </div>
  );
};

export default BrassVisualizer;