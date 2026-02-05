import React, { useEffect, useRef } from 'react';
import { Note } from '@tonaljs/tonal';
import * as Tone from 'tone';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const Piano = ({ scaleNotes, tonic, useSharps }) => {
  // Referencia al sintetizador para que persista entre renderizados
  const synth = useRef(null);

  useEffect(() => {
    // Inicializamos el sintetizador con un toque "Industrial" (Sawtooth + Reverb sutil)
    synth.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "fatsawtooth" }, // Sonido más agresivo/industrial
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 1 }
    }).toDestination();
    
    // Bajamos un poco el volumen global para no saturar
    synth.current.volume.value = -8;

    return () => {
      if (synth.current) synth.current.dispose();
    };
  }, []);

  const playNote = (note, octave) => {
    // Activamos el contexto de audio (necesario en navegadores modernos)
    if (Tone.context.state !== "running") Tone.start();
    
    // Tonal devuelve notas tipo "C#", Tone.js necesita octava "C#4"
    const fullNote = `${note}${octave}`;
    
    // Disparamos la nota (duración: 8n = corchea)
    synth.current.triggerAttackRelease(fullNote, "8n");
  };

  const renderOctave = (octaveNumber) => {
    return NOTES.map((note, index) => {
      const isBlack = note.includes('#');
      const isInScale = scaleNotes.some(n => Note.chroma(n) === Note.chroma(note));
      const isRoot = Note.chroma(note) === Note.chroma(tonic);

      // --- NOMBRES ---
      let displayNote = note;
      if (!useSharps && note.includes('#')) displayNote = Note.enharmonic(note);
      if (useSharps && note.includes('b')) displayNote = Note.enharmonic(note);
      displayNote = Note.simplify(displayNote);

      if (isBlack) return null;

      const nextNote = NOTES[index + 1];
      const hasBlack = nextNote && nextNote.includes('#');
      
      let isBlackInScale = false;
      let isBlackRoot = false;
      let blackDisplay = '';
      
      if (hasBlack) {
        isBlackInScale = scaleNotes.some(n => Note.chroma(n) === Note.chroma(nextNote));
        isBlackRoot = Note.chroma(nextNote) === Note.chroma(tonic);
        blackDisplay = nextNote;
        if (!useSharps) blackDisplay = Note.enharmonic(nextNote);
      }

      return (
        <div key={`${note}${octaveNumber}`} className="relative flex-shrink-0">
          
          {/* ================= TECLA BLANCA ================= */}
          <button 
            // AÑADIDO: Evento Click
            onClick={() => playNote(note, octaveNumber)}
            className={`
              w-10 sm:w-14 h-32 sm:h-48 rounded-b-md flex flex-col items-center justify-end pb-3 transition-all duration-100 border-b-4 z-10 relative font-bold 
              border-x border-black outline-none active:scale-[0.98] active:brightness-90
              ${isInScale 
                ? 'bg-red-600 text-white border-b-red-900 z-20 shadow-[0_0_15px_rgba(220,38,38,0.4)]' // Añadí un glow suave
                : 'bg-gray-100 text-gray-900 border-b-gray-400 opacity-80 hover:opacity-100' 
              }
            `}
          >
            {isInScale && (
              <>
                <span className="text-sm font-black mb-1 pointer-events-none">{displayNote}</span>
                {isRoot && (
                  <div className="w-3 h-3 rounded-full bg-[#222] mt-1 border border-red-400"></div>
                )}
              </>
            )}
          </button>
          
          {/* ================= TECLA NEGRA ================= */}
          {hasBlack && (
            <button 
               // AÑADIDO: Evento Click
              onClick={(e) => {
                e.stopPropagation(); // Evitar disparar la tecla blanca de abajo
                playNote(nextNote, octaveNumber);
              }}
              className={`
                absolute -right-3 sm:-right-4 top-0 w-6 sm:w-9 h-20 sm:h-32 z-30 rounded-b-md flex items-end justify-center pb-3 border-b-4 transition-all duration-100
                border-x border-black outline-none active:scale-[0.98] active:brightness-110
                ${isBlackInScale 
                   ? 'bg-red-800 text-white border-b-red-950 shadow-[0_0_10px_rgba(153,27,27,0.5)]' 
                   : 'bg-gray-900 border-b-black opacity-95 hover:bg-gray-800'
                }
              `}
            >
              {isBlackInScale && (
                 <div className="flex flex-col items-center gap-1 pointer-events-none">
                    <span className="text-[10px] font-black text-white/90">
                      {blackDisplay}
                    </span>
                    {isBlackRoot && (
                       <div className="w-2.5 h-2.5 rounded-full bg-white border border-red-900"></div>
                    )}
                 </div>
              )}
            </button>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-full overflow-x-auto pb-8 pt-4 select-none">
      <div className="flex justify-center min-w-max mx-auto bg-[#222] p-4 pt-8 md:p-8 border-t-4 border-street-border rounded-xl shadow-xl relative">
        {/* Etiqueta decorativa estilo industrial */}
        <div className="absolute top-2 left-4 text-[10px] text-street-muted font-mono tracking-widest border border-street-muted px-1 rounded opacity-50">
          SYNTH_MODULE_V1
        </div>
        
        {renderOctave(3)}
        {renderOctave(4)}
      </div>
    </div>
  );
};

export default Piano;