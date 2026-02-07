import React, { useState, useEffect } from 'react';
import { Note, Interval } from '@tonaljs/tonal';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../components/ui/CustomSelect';
import NoteSelector from '../components/ui/NoteSelector'; // <--- USAMOS EL NUEVO

// --- CONFIGURACIÓN DE INSTRUMENTOS ---
const INSTRUMENTS = [
    { value: 'C', label: 'Instrumento en Do (Bassoon/Piano)', offset: 0 },
    { value: 'Bb', label: 'Instrumento en Sib (Trompeta/Clarinete)', offset: -2 }, 
    { value: 'Eb', label: 'Instrumento en Mib (Saxo Alto)', offset: -9 }, 
    { value: 'F', label: 'Instrumento en Fa (Corno)', offset: -7 }, 
];

const TRUMPET_FINGERINGS = {
  'F#3': [1, 2, 3], 'Gb3': [1, 2, 3],
  'G3':  [1, 3], 'G#3': [2, 3], 'Ab3': [2, 3],
  'A3':  [1, 2], 'A#3': [1], 'Bb3': [1], 'B3':  [2],
  'C4':  [0], 'C#4': [1, 2, 3], 'Db4': [1, 2, 3],
  'D4':  [1, 3], 'D#4': [2, 3], 'Eb4': [2, 3],
  'E4':  [1, 2], 'F4':  [1], 'F#4': [2], 'Gb4': [2],
  'G4':  [0], 'G#4': [2, 3], 'Ab4': [2, 3],
  'A4':  [1, 2], 'A#4': [1], 'Bb4': [1], 'B4':  [2],
  'C5':  [0], 'C#5': [1, 2], 'Db5': [1, 2],
  'D5':  [1], 'D#5': [2], 'Eb5': [2],
  'E5':  [0], 'F5':  [1], 'F#5': [2], 'Gb5': [2],
  'G5':  [0], 'G#5': [2, 3], 'Ab5': [2, 3],
  'A5':  [1, 2], 'A#5': [1], 'Bb5': [1], 'B5':  [2],
  'C6':  [0]
};

// Generamos la lista lineal de notas
const FULL_CHROMATIC_SCALE = [];
const notes = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
for (let oct = 3; oct <= 6; oct++) {
    notes.forEach(n => {
        if (oct === 6 && n !== 'C') return;
        FULL_CHROMATIC_SCALE.push({ value: `${n}${oct}`, label: `${n}${oct}` });
    });
}

const isTrumpetRange = (note) => {
    try {
        const pitch = Note.get(note);
        if (!pitch.height) return false;
        return pitch.midi >= 54 && pitch.midi <= 84;
    } catch (e) { return false; }
};

const Valve = ({ isActive, label }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-12 h-12 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-kinetic border-kinetic shadow-[0_0_15px_rgba(255,34,0,0.5)]' : 'bg-transparent border-white/20'}`}>
      <div className={`w-8 h-8 rounded-full border border-white/10 ${isActive ? 'bg-white/10' : 'bg-transparent'}`}></div>
    </div>
    <span className="font-mono text-[10px] text-white/40 uppercase">{label}</span>
  </div>
);

const TranspositionPage = () => {
  const [note, setNote] = useState('C4');
  const [sourceInst, setSourceInst] = useState(INSTRUMENTS[1]); 
  const [targetInst, setTargetInst] = useState(INSTRUMENTS[0]); 
  
  const [resultNote, setResultNote] = useState('');
  const [explanation, setExplanation] = useState('');
  const [fingering, setFingering] = useState([]);
  const [outOfRange, setOutOfRange] = useState(false);

  useEffect(() => {
    if (!sourceInst || !targetInst) return;

    const semitoneDiff = sourceInst.offset - targetInst.offset;
    const interval = Interval.fromSemitones(semitoneDiff);
    const calculated = Note.transpose(note, interval);
    const simplified = Note.simplify(calculated);

    setResultNote(simplified);

    let direction = semitoneDiff > 0 ? 'Subir' : 'Bajar';
    let amount = Math.abs(semitoneDiff);
    let unit = amount === 1 ? 'semitono' : 'semitonos';
    
    if (amount % 2 === 0 && amount !== 0) {
        amount = amount / 2;
        unit = amount === 1 ? 'tono' : 'tonos';
    }
    
    if (semitoneDiff === 0) {
        setExplanation("Misma afinación.");
    } else {
        setExplanation(`Debes ${direction} ${amount} ${unit} a lo escrito.`);
    }

    if (targetInst.value === 'Bb') {
        const checkRange = isTrumpetRange(simplified);
        if (!checkRange) {
            setOutOfRange(true);
            setFingering([]);
        } else {
            setOutOfRange(false);
            const mapKey = simplified;
            let fingerData = TRUMPET_FINGERINGS[mapKey];
            if (!fingerData) {
                fingerData = TRUMPET_FINGERINGS[Note.enharmonic(mapKey)];
            }
            setFingering(fingerData || []);
        }
    } else {
        setOutOfRange(false);
        setFingering([]);
    }

  }, [note, sourceInst, targetInst]);

  return (
    <div className="pb-32 px-4 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="pt-10 mb-16 border-b border-black/10 pb-6 flex justify-between items-end"
      >
        <div>
          <h1 className="font-display text-5xl md:text-7xl text-ash uppercase tracking-tighter mb-2">
            Transposición
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-kinetic"></div>
            <p className="font-mono text-kinetic text-xs uppercase tracking-[0.2em]">
              Calculadora Universal
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}
        <motion.div className="lg:col-span-5 space-y-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
           
           <div className="bg-white p-8 border border-black/5 rounded-lg shadow-sm space-y-10">
              
              {/* 1. ORIGEN */}
              <div className="relative">
                 <div className="absolute -left-4 top-2 w-1 h-8 bg-ash"></div>
                 <CustomSelect 
                    label="1. ¿Qué partitura estás leyendo? (Origen)"
                    value={sourceInst.value}
                    options={INSTRUMENTS}
                    onChange={(val) => setSourceInst(INSTRUMENTS.find(i => i.value === val))}
                 />
              </div>

              {/* 2. LA NOTA (NUEVO SELECTOR DE PRECISIÓN) */}
              <div className="relative">
                 <div className="flex justify-between items-center mb-4">
                     <span className="font-mono text-[10px] text-ash-dim uppercase tracking-widest block">
                        2. Nota Escrita
                     </span>
                     <span className="font-display text-kinetic text-xl">
                        {note}
                     </span>
                 </div>
                 
                 {/* Componente Renovado */}
                 <div className="rounded-lg overflow-hidden border border-black/10 shadow-inner bg-void-light">
                     <NoteSelector 
                        options={FULL_CHROMATIC_SCALE} 
                        value={note} 
                        onChange={setNote} 
                     />
                 </div>
              </div>

              {/* 3. DESTINO */}
              <div className="relative">
                 <div className="absolute -left-4 top-2 w-1 h-8 bg-kinetic"></div>
                 <CustomSelect 
                    label="3. ¿Qué instrumento tocas tú? (Destino)"
                    value={targetInst.value}
                    options={INSTRUMENTS}
                    onChange={(val) => setTargetInst(INSTRUMENTS.find(i => i.value === val))}
                 />
              </div>

           </div>
        </motion.div>

        {/* COLUMNA DERECHA: COCKPIT */}
        <motion.div className="lg:col-span-7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
           <div className="bg-[#111111] text-white p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between border border-white/5">
              
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              <div className="relative z-10 flex justify-between items-start border-b border-white/10 pb-6">
                 <div>
                    <span className="font-mono text-kinetic text-xs uppercase tracking-widest block mb-1">
                      Debes Tocar:
                    </span>
                    <span className="font-mono text-white/50 text-[10px] uppercase">
                       {explanation}
                    </span>
                 </div>
                 <div className="text-right">
                    <span className="font-display text-white/10 text-4xl tracking-tighter">OUTPUT</span>
                 </div>
              </div>

              <div className="relative z-10 flex justify-center items-center py-8">
                 <AnimatePresence mode='wait'>
                    <motion.div
                      key={resultNote}
                      initial={{ scale: 0.8, opacity: 0, blur: "10px" }}
                      animate={{ scale: 1, opacity: 1, blur: "0px" }}
                      exit={{ scale: 1.1, opacity: 0 }}
                      className="text-center"
                    >
                      {outOfRange && targetInst.value === 'Bb' ? (
                          <div className="flex flex-col items-center animate-pulse">
                              <span className="text-6xl md:text-8xl font-display text-white/20">{resultNote}</span>
                              <span className="text-kinetic font-mono text-xs uppercase tracking-widest mt-4 border border-kinetic px-3 py-1 rounded">
                                  ⚠️ Fuera de Rango Físico
                              </span>
                          </div>
                      ) : (
                          <h2 className="font-display text-[8rem] md:text-[11rem] leading-none tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                            {resultNote.replace(/\d/, '')}
                            <span className="text-3xl text-white/30 font-mono align-top ml-2">
                                {resultNote.match(/\d/)}
                            </span>
                          </h2>
                      )}
                    </motion.div>
                 </AnimatePresence>
              </div>

              <div className="relative z-10 border-t border-white/10 pt-8 min-h-[100px] flex items-center justify-center">
                 {targetInst.value === 'Bb' ? (
                    !outOfRange ? (
                        <div className="flex flex-col items-center gap-4">
                           <div className="flex gap-6 bg-white/5 px-8 py-4 rounded-full border border-white/10 backdrop-blur-sm">
                              <Valve label="1" isActive={fingering.includes(1)} />
                              <Valve label="2" isActive={fingering.includes(2)} />
                              <Valve label="3" isActive={fingering.includes(3)} />
                           </div>
                           <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
                              Digitación para Trompeta (Bb)
                           </p>
                        </div>
                    ) : (
                        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest text-center max-w-xs">
                           Esta nota excede el registro estándar de la trompeta.
                        </p>
                    )
                 ) : (
                    <div className="text-center opacity-60">
                       <p className="font-display text-xl text-white/80 mb-1">
                          {targetInst.label.split('(')[0]}
                       </p>
                       <p className="font-mono text-[10px] uppercase text-white/40">
                          {targetInst.value === 'C' ? 'Lectura directa' : 'Visualización de llaves en desarrollo'}
                       </p>
                    </div>
                 )}
              </div>

           </div>
           
           <div className="mt-4 flex justify-between items-center opacity-50 px-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-ash-dim">
                 LOUD Transpose Engine v2.0
              </span>
           </div>

        </motion.div>
      </div>
    </div>
  );
};

export default TranspositionPage;