import React, { useState } from 'react';
import { Key, Chord, Note } from '@tonaljs/tonal';
import { motion } from 'framer-motion';
import CustomSelect from '../components/ui/CustomSelect';

const HarmonizationPage = () => {
  const [root, setRoot] = useState('C');
  const [mode, setMode] = useState('major'); 
  // Estado para controlar la enarmonía (False = Preferencia Bemoles/Original, True = Forzar Sostenidos)
  const [useSharps, setUseSharps] = useState(false);

  // Helper para formatear notas/acordes según la preferencia
  const formatName = (name) => {
    if (!name) return "";
    // Si queremos sostenidos y el nombre tiene bemol (b), buscamos el enarmónico
    if (useSharps && name.includes('b')) return Note.enharmonic(name);
    // Si queremos bemoles (o desactivar sostenidos) y tiene #, buscamos el enarmónico
    // NOTA: A veces es mejor dejar la nota original si no se fuerza lo contrario, 
    // pero para este botón "togle" haremos el cambio estricto para que se note el efecto.
    if (!useSharps && name.includes('#')) return Note.enharmonic(name);
    return name;
  };

  const getData = () => {
    const minorData = Key.minorKey(root);
    switch (mode) {
      case 'major': return Key.majorKey(root);
      case 'natural': return minorData.natural;
      case 'harmonic': return minorData.harmonic;
      case 'melodic': return minorData.melodic;
      default: return Key.majorKey(root);
    }
  };

  const keyInfo = getData();
  
  const chords = keyInfo?.grades?.map((grade, i) => {
    const originalChordName = keyInfo.chords[i];
    const chordDetails = Chord.get(originalChordName);
    
    // 1. Formateamos la nota raíz del acorde (ej: Db -> C#)
    const rootNote = chordDetails.tonic;
    const formattedRoot = formatName(rootNote);
    
    // 2. Reconstruimos el nombre del acorde (ej: C# + maj7)
    // chordDetails.aliases[0] suele dar la cualidad (maj7, m7, etc)
    // O podemos usar chordDetails.symbol y reemplazar la tónica.
    // Una forma segura es reemplazar la tónica original en el símbolo por la nueva.
    const formattedChordName = originalChordName.replace(rootNote, formattedRoot);

    // 3. Formateamos las notas individuales
    const formattedNotes = chordDetails.notes.map(n => formatName(n));

    return {
      grade,
      chord: formattedChordName, // Nombre ajustado (ej: C#maj7)
      notes: formattedNotes,     // Notas ajustadas (ej: E#, G#...)
    };
  }) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="pb-32 px-4 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="pt-10 mb-16 border-b border-black/10 pb-6"
      >
        <h1 className="font-display text-5xl md:text-7xl text-ash uppercase tracking-tighter mb-2">
          Armonización
        </h1>
        <div className="flex items-center gap-3">
          <div className="h-px w-10 bg-kinetic"></div>
          <p className="font-mono text-kinetic text-xs uppercase tracking-[0.2em]">
            Generador de Acordes
          </p>
        </div>
      </motion.div>

      {/* CONTROLES */}
      <div className="sticky top-24 z-40 mb-12">
        <div className="bg-white/80 backdrop-blur-xl border border-black/5 p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-6 items-end">
           <div className="w-full md:w-40">
              <CustomSelect 
                  label="Tónica"
                  value={root} 
                  onChange={setRoot}
                  options={['C','C#','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'].map(n => ({ value: n, label: n }))}
              />
           </div>
           <div className="w-full md:w-80">
              <CustomSelect 
                  label="Tipo de Escala"
                  value={mode} 
                  onChange={setMode}
                  options={[
                    { value: 'major', label: 'Mayor (Jónica)' },
                    { value: 'natural', label: 'Menor Natural' },
                    { value: 'harmonic', label: 'Menor Armónica' },
                    { value: 'melodic', label: 'Menor Melódica' }
                  ]}
              />
           </div>

           {/* BOTÓN TOGGLE ENARMONÍA (Nuevo) */}
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
                {/* Indicador Visual (Switch) */}
                <div className={`w-8 h-4 rounded-full border border-black/10 relative transition-colors ${useSharps ? 'bg-kinetic border-kinetic' : 'bg-black/5'}`}>
                   <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-all ${useSharps ? 'left-4' : 'left-0.5'}`}></div>
                </div>
             </button>
           </div>
        </div>
      </div>

      {/* GRID DE ACORDES */}
      {chords.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {chords.map((c, i) => (
            <motion.div 
              key={i} 
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white border border-black/10 p-8 relative overflow-hidden group min-h-[220px] flex flex-col justify-between rounded-sm shadow-sm hover:shadow-xl hover:border-kinetic/50 transition-all duration-300"
            >
              <span className="absolute -right-4 -bottom-6 text-[10rem] font-display text-black/[0.03] group-hover:text-kinetic/[0.05] transition-colors select-none pointer-events-none">
                {c.grade}
              </span>
              
              <div className="relative z-10 w-full">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-ash-dim font-mono text-[10px] uppercase tracking-widest border border-black/10 px-2 py-1 rounded group-hover:border-kinetic group-hover:text-kinetic transition-colors">
                      Grado {c.grade}
                    </span>
                  </div>
                  
                  {/* Nombre del Acorde (Dinámico) */}
                  <h2 className="text-4xl md:text-5xl font-display text-ash mb-2 tracking-tight group-hover:translate-y-[-2px] transition-transform">
                    {c.chord}
                  </h2>
                  
                  <div className="mt-6 border-t border-black/5 pt-4 group-hover:border-kinetic/20 transition-colors">
                    <p className="font-mono text-[10px] text-ash-dim uppercase tracking-widest mb-2 opacity-100">
                      Componentes:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {c.notes.map((note, index) => (
                        <span 
                          key={index} 
                          className="font-mono font-bold text-sm text-ash bg-black/5 px-2 py-1 rounded-sm group-hover:bg-kinetic group-hover:text-white transition-colors duration-200"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
              </div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-kinetic rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-0 group-hover:scale-100"></div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="border border-dashed border-black/20 p-20 text-center rounded-xl bg-white/50">
          <p className="font-mono text-ash-dim animate-pulse">Calculando armonía...</p>
        </div>
      )}
    </div>
  );
};

export default HarmonizationPage;