import React, { useState } from 'react';
import { Scale, Note } from '@tonaljs/tonal';
import { motion } from 'framer-motion';
import Piano from '../components/Piano';
import CircleOfFifths from '../components/CircleOfFifths';
import CustomSelect from '../components/ui/CustomSelect'; 
import Hero from '../components/Hero'; 

const NOTES = ['C', 'C#', 'Db','D', 'D#','Eb', 'E', 'F', 'F#','Gb', 'G', 'G#','Ab', 'A', 'A#','Bb', 'B'];

const SCALE_TYPES = [
  { value: "major", label: "Mayor (Jónica)" },
  { value: "minor", label: "Menor (Eólica)" },
  { value: "harmonic minor", label: "Menor Armónica" },
  { value: "melodic minor", label: "Menor Melódica" },
  { value: "dorian", label: "Dórica" },
  { value: "phrygian", label: "Frigia" },
  { value: "lydian", label: "Lidia" },
  { value: "mixolydian", label: "Mixolidia" },
  { value: "locrian", label: "Locria" },
  { value: "pentatonic", label: "Pentatónica Mayor" },
  { value: "blues", label: "Blues" },
];

const ScalesPage = () => {
  const [root, setRoot] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  // Estado para la enarmonía
  const [useSharps, setUseSharps] = useState(false);

  // Lógica de Tonal
  const scaleData = Scale.get(`${root} ${scaleType}`);

  // Helper para mostrar la nota correcta en la tabla de intervalos según el botón
  const formatNoteName = (n) => {
    if (useSharps && n.includes('b')) return Note.enharmonic(n);
    if (!useSharps && n.includes('#')) return Note.enharmonic(n);
    return Note.simplify(n);
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="pb-40">
      
      <Hero />

      {/* ESPACIO DE TRABAJO */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        className="max-w-7xl mx-auto px-4 mt-20"
      >
        
        {/* Encabezado */}
        <div className="flex items-end justify-between border-b border-black/10 pb-6 mb-12">
            <div>
                <h2 className="font-display text-5xl text-ash uppercase tracking-tight">Espacio de Trabajo</h2>
                <div className="h-1 w-20 bg-kinetic mt-2"></div>
            </div>
            <span className="font-mono text-kinetic text-xs uppercase tracking-widest bg-kinetic/10 px-3 py-1 border border-kinetic/20">
                01 / Visualizador
            </span>
        </div>

        {/* CONTROLES */}
        <div className="sticky top-24 z-40 mb-16">
            <div className="bg-white/80 backdrop-blur-xl border border-black/5 p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-6 items-end">
                
                <div className="w-full md:w-32">
                    <CustomSelect 
                        label="Tónica" 
                        value={root} 
                        options={NOTES.map(n => ({ value: n, label: n }))} 
                        onChange={setRoot} 
                    />
                </div>

                <div className="w-full md:w-72">
                    <CustomSelect 
                        label="Escala / Modo" 
                        value={scaleType} 
                        options={SCALE_TYPES} 
                        onChange={setScaleType} 
                    />
                </div>

                {/* BOTÓN DE ENARMONÍA (Recuperado) */}
                <div className="w-full md:w-auto flex-grow flex justify-end pb-1">
                   <button 
                      onClick={() => setUseSharps(!useSharps)}
                      className="group flex items-center gap-3 px-4 py-3 border border-black/10 rounded-lg hover:border-kinetic/50 hover:bg-kinetic/5 transition-all active:scale-95"
                   >
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-[9px] text-ash-dim uppercase tracking-widest group-hover:text-kinetic">
                          Visualización
                        </span>
                        <span className="font-display text-sm text-ash font-bold">
                          {useSharps ? "Ver Bemoles (b)" : "Ver Sostenidos (#)"}
                        </span>
                      </div>
                      {/* Switch Visual */}
                      <div className={`w-8 h-4 rounded-full border border-black/10 relative transition-colors ${useSharps ? 'bg-kinetic border-kinetic' : 'bg-black/5'}`}>
                         <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-all ${useSharps ? 'left-4' : 'left-0.5'}`}></div>
                      </div>
                   </button>
                </div>
            </div>
        </div>

        {/* PIANO INTERACTIVO (Pasamos useSharps) */}
        <div className="mb-20">
             <Piano scaleNotes={scaleData.notes} tonic={root} useSharps={useSharps} />
        </div>

        {/* GRID DE DATOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-black/5 pt-16">
            
            {/* Intervalos */}
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="font-mono text-ash-dim text-sm uppercase tracking-widest">Intervalos & Estructura</h3>
                    <span className="text-[10px] text-kinetic font-mono border border-kinetic/30 px-2 py-1 rounded">Teoría</span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {scaleData.intervals.map((int, i) => (
                        <div key={i} className="bg-white border border-black/5 p-4 hover:border-kinetic/50 transition-colors group cursor-default shadow-sm">
                            <span className="block text-[10px] font-mono text-ash-dim mb-2">{int}</span>
                            <span className="block font-display text-2xl text-ash group-hover:text-kinetic transition-colors">
                                {/* Aplicamos el formato según el botón */}
                                {formatNoteName(scaleData.notes[i])} 
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Círculo de Quintas */}
            <div className="space-y-8 flex flex-col items-center lg:items-end">
                <div className="w-full flex justify-between items-center border-b border-black/5 pb-2 lg:justify-end lg:gap-4 lg:border-none">
                     <h3 className="font-mono text-ash-dim text-sm uppercase tracking-widest">Círculo de Quintas</h3>
                </div>

                <div className="relative p-6">
                    <div className="absolute inset-0 bg-gradient-to-tr from-kinetic/5 to-transparent rounded-full blur-3xl"></div>
                    
                    {(scaleType === 'major' || scaleType === 'minor') ? (
                        <CircleOfFifths currentRoot={root} onRootChange={setRoot} />
                    ) : (
                        <div className="w-[300px] h-[300px] border border-dashed border-black/10 rounded-full flex items-center justify-center text-center p-8 bg-white/50">
                            <p className="font-mono text-xs text-ash-dim uppercase">
                                Visualización disponible solo en modos Mayor/Menor
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>

      </motion.div>
    </div>
  );
};

export default ScalesPage;