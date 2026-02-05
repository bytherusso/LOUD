import React, { useState } from 'react';
import { Scale, Note } from '@tonaljs/tonal';
import Piano from '../components/Piano';
import CircleOfFifths from '../components/CircleOfFifths';

const NOTES = ['C', 'C#', 'Db','D', 'D#','Eb', 'E', 'F', 'F#','Gb', 'G', 'G#','Ab', 'A', 'A#','Bb', 'B'];
const SCALE_TYPES = ["major", "minor", "harmonic minor", "melodic minor", "dorian", "phrygian", "lydian", "mixolydian", "locrian", "blues", "pentatonic"];

const ScalesPage = () => {
  const [root, setRoot] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [useSharps, setUseSharps] = useState(false);

  // 1. Obtener datos de la escala
  const scaleData = Scale.get(`${root} ${scaleType}`);
  
  // 2. Procesar notas para visualización (manejo de # vs b)
  const scaleNotesDisplay = scaleData.notes.map(n => {
    if (useSharps && n.includes('b')) return Note.enharmonic(n);
    if (!useSharps && n.includes('#')) return Note.enharmonic(n); // Opcional: forzar bemoles
    return Note.simplify(n);
  });

  return (
    <div className="space-y-10 animate-fade-in">
      {/* --- HEADER --- */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-6xl text-street-accent drop-shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
          Escalas & Teoría
        </h1>
        <p className="text-street-muted uppercase font-bold tracking-widest text-sm">
          Domina el lenguaje musical
        </p>
      </div>

      {/* --- CONTROLES --- */}
      <div className="bg-street-card p-6 md:p-8 border-2 border-street-border rounded-xl shadow-hard flex flex-col md:flex-row gap-6 justify-center items-end">
        {/* Selector Tónica */}
        <div className="w-full md:w-auto">
          <label className="block text-street-accent font-black uppercase text-xs mb-2 tracking-wider">Tónica</label>
          <select 
            value={root} onChange={(e) => setRoot(e.target.value)}
            className="w-full bg-street-dark text-white p-3 font-bold border-2 border-street-muted focus:border-street-accent outline-none rounded-md uppercase"
          >
            {NOTES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {/* Selector Escala */}
        <div className="w-full md:w-auto">
          <label className="block text-street-accent font-black uppercase text-xs mb-2 tracking-wider">Escala</label>
          <select 
            value={scaleType} onChange={(e) => setScaleType(e.target.value)}
            className="w-full bg-street-dark text-white p-3 font-bold border-2 border-street-muted focus:border-street-accent outline-none rounded-md uppercase"
          >
            {SCALE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>

        {/* Toggle Sharps/Flats */}
        <button 
          onClick={() => setUseSharps(!useSharps)}
          className={`w-full md:w-auto p-3 border-2 font-bold uppercase tracking-wider rounded-md transition-all ${useSharps ? 'bg-street-accent text-street-dark border-street-accent' : 'border-street-muted text-street-muted hover:text-white'}`}
        >
          {useSharps ? "Ver Bemoles (b)" : "Ver Sostenidos (#)"}
        </button>
      </div>

      {/* --- CÍRCULO DE QUINTAS (Solo Mayor/Menor) --- */}
      {(scaleType === 'major' || scaleType === 'minor') && (
        <div className="py-4">
           <CircleOfFifths currentRoot={root} onRootChange={setRoot} />
        </div>
      )}

      {/* --- PIANO VISUALIZER --- */}
      <div>
        <Piano scaleNotes={scaleData.notes} tonic={root} useSharps={useSharps} />
      </div>

      {/* --- INFO BOX --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notas */}
        <div className="bg-street-card p-6 border-2 border-street-border rounded-xl shadow-hard-sm">
          <h3 className="text-street-accent mb-4 text-xl">Notas</h3>
          <div className="flex flex-wrap gap-2">
            {scaleNotesDisplay.map((n, i) => (
              <span key={i} className={`text-2xl font-black ${i===0 ? 'text-street-accent' : 'text-white'}`}>
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Intervalos */}
        <div className="bg-street-card p-6 border-2 border-street-border rounded-xl shadow-hard-sm">
          <h3 className="text-street-accent mb-4 text-xl">Intervalos</h3>
          <p className="font-mono text-street-text/80 text-lg">
            {scaleData.intervals.join(' - ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScalesPage;