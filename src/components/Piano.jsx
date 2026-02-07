import React, { useEffect, useRef } from 'react';
import { Note } from '@tonaljs/tonal';
import * as Tone from 'tone';
import { motion } from 'framer-motion';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const Piano = ({ scaleNotes, tonic, useSharps }) => {
  const synth = useRef(null);

  useEffect(() => {
    synth.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 1 }
    }).toDestination();
    synth.current.volume.value = -6;
    return () => synth.current?.dispose();
  }, []);

  const playNote = (n, o) => {
    if (Tone.context.state !== "running") Tone.start();
    // Siempre simplificamos la nota para que Tone.js la entienda (ej: B# -> C)
    const playName = Note.simplify(n);
    synth.current.triggerAttackRelease(`${playName}${o}`, "8n");
  };

  // Función para formatear el TEXTO que ve el usuario (Visualización)
  const getDisplayLabel = (note) => {
    if (useSharps && note.includes('b')) return Note.enharmonic(note);
    if (!useSharps && note.includes('#')) return Note.enharmonic(note);
    return Note.simplify(note);
  };

  const renderOctave = (octaveNumber) => {
    return NOTES.map((physicalNote, index) => {
      const isBlack = physicalNote.includes('#');
      
      // Chequeamos si esta tecla física es parte de la escala seleccionada
      // Usamos Note.chroma para comparar "alturas" sin importar si se llama C# o Db
      const matchedScaleNote = scaleNotes.find(n => Note.chroma(n) === Note.chroma(physicalNote));
      const isInScale = !!matchedScaleNote;
      const isRoot = isInScale && Note.chroma(matchedScaleNote) === Note.chroma(tonic);

      // Etiqueta a mostrar dentro de la tecla
      const label = getDisplayLabel(physicalNote);

      if (isBlack) return null;

      // Lógica para la tecla negra asociada (la que está a la derecha de esta blanca)
      const nextPhysical = NOTES[index + 1];
      const hasBlack = nextPhysical && nextPhysical.includes('#');
      
      let blackIsInScale = false;
      let blackLabel = '';
      let blackIsRoot = false;

      if (hasBlack) {
        const matchedBlack = scaleNotes.find(n => Note.chroma(n) === Note.chroma(nextPhysical));
        blackIsInScale = !!matchedBlack;
        blackLabel = getDisplayLabel(nextPhysical);
        blackIsRoot = blackIsInScale && Note.chroma(matchedBlack) === Note.chroma(tonic);
      }

      // --- ESTILOS VISUALES (Rojo Sólido) ---
      
      // TECLA BLANCA
      const whiteStyle = isInScale
        ? 'bg-kinetic text-white shadow-md z-10 border-b-[4px] border-[#b31900]' // ACTIVA (ROJA)
        : 'bg-white text-ash/30 border-b-[4px] border-[#e5e5e5] hover:bg-gray-50'; // INACTIVA (BLANCA)

      // TECLA NEGRA
      const blackStyle = blackIsInScale
        ? 'bg-kinetic text-white border-b-[6px] border-[#990000] shadow-lg z-30' // ACTIVA (ROJA)
        : 'bg-[#1a1a1a] text-ash/30 border-b-[6px] border-black z-20'; // INACTIVA (NEGRA)

      return (
        <div key={`${physicalNote}${octaveNumber}`} className="relative flex-shrink-0 group">
          
          {/* === TECLA BLANCA === */}
          <motion.button 
            whileHover={{ y: 2 }}
            whileTap={{ y: 4 }}
            onClick={() => playNote(physicalNote, octaveNumber)}
            className={`
              relative w-12 sm:w-16 h-48 flex flex-col items-center justify-end pb-4 
              transition-colors duration-200 outline-none rounded-b-md border-r border-black/5
              ${whiteStyle}
            `}
          >
            <div className="flex flex-col items-center gap-1">
               {/* Nombre de la nota */}
               <span className={`font-display font-bold text-lg tracking-tighter ${isInScale ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                 {label}
               </span>
               {/* Punto Tónica */}
               {isRoot && <div className="w-2 h-2 rounded-full bg-white shadow-sm mb-1"></div>}
            </div>
          </motion.button>
          
          {/* === TECLA NEGRA === */}
          {hasBlack && (
            <motion.button 
              whileHover={{ y: 2 }}
              whileTap={{ y: 4 }}
              onClick={(e) => { e.stopPropagation(); playNote(nextPhysical, octaveNumber); }}
              className={`
                absolute -right-4 sm:-right-5 top-0 w-8 sm:w-10 h-28 sm:h-32 
                flex items-end justify-center pb-3 transition-colors duration-200 outline-none rounded-b-md
                ${blackStyle}
              `}
            >
               <div className="flex flex-col items-center pointer-events-none">
                  {/* Nombre Nota Negra */}
                  <span className={`font-display font-bold text-sm tracking-tighter mb-1 ${blackIsInScale ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                     {blackLabel}
                  </span>
                  {blackIsRoot && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
               </div>
            </motion.button>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-full relative py-8 px-4 bg-void-light border border-black/5 rounded-xl shadow-sm">
      <div className="overflow-x-auto pb-4 scrollbar-hide flex justify-center">
        {/* Contenedor del teclado */}
        <div className="flex relative"> 
          {renderOctave(3)}
          {renderOctave(4)}
        </div>
      </div>
    </div>
  );
};

export default Piano;