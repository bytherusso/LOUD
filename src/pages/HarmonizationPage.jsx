import React, { useState } from 'react';
import { Key } from '@tonaljs/tonal';

const HarmonizationPage = () => {
  const [root, setRoot] = useState('C');
  // Ahora usamos identificadores únicos para cada tipo
  const [mode, setMode] = useState('major'); 

  const getData = () => {
    // Obtenemos el objeto completo de la tonalidad menor
    const minorData = Key.minorKey(root);

    switch (mode) {
      case 'major':
        return Key.majorKey(root);
      case 'natural':
        return minorData.natural;
      case 'harmonic':
        return minorData.harmonic;
      case 'melodic':
        return minorData.melodic;
      default:
        return Key.majorKey(root);
    }
  };

  const keyInfo = getData();
  
  // Mapeamos los acordes asegurándonos de que existan datos
  const chords = keyInfo?.grades?.map((grade, i) => ({
    grade,
    chord: keyInfo.chords[i], // Acordes de séptima
    triad: keyInfo.triads[i], // Tríadas
  })) || [];

  return (
    <div className="space-y-10 animate-fade-in">
      <header className="text-center">
        <h1 className="text-4xl md:text-6xl text-white mb-2 uppercase">Armonización</h1>
        <p className="text-street-muted font-bold tracking-widest uppercase text-sm">
          Acordes diatónicos por escala
        </p>
      </header>

      {/* Controles */}
      <div className="flex flex-col md:flex-row justify-center gap-4 bg-street-card p-6 border-2 border-street-border rounded-xl shadow-hard max-w-3xl mx-auto">
        <div className="w-full md:w-1/3">
          <label className="text-street-accent text-xs font-black uppercase tracking-wider mb-2 block">Tónica</label>
          <select 
            value={root} onChange={e => setRoot(e.target.value)}
            className="w-full bg-street-dark border-2 border-street-muted text-white p-3 font-bold focus:border-street-accent outline-none rounded-md uppercase"
          >
            {['C','C#','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>

        <div className="w-full md:w-2/3">
          <label className="text-street-accent text-xs font-black uppercase tracking-wider mb-2 block">Tipo de Escala</label>
          <select 
            value={mode} onChange={e => setMode(e.target.value)}
            className="w-full bg-street-dark border-2 border-street-muted text-white p-3 font-bold focus:border-street-accent outline-none rounded-md uppercase"
          >
            <option value="major">Mayor (Jónica)</option>
            <option value="natural">Menor Natural (Eólica)</option>
            <option value="harmonic">Menor Armónica</option>
            <option value="melodic">Menor Melódica</option>
          </select>
        </div>
      </div>

      {/* Grid de Acordes */}
      {chords.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {chords.map((c, i) => (
            <div key={i} className="bg-street-card border-2 border-street-border p-6 hover:border-street-accent hover:shadow-hard transition-all cursor-default group rounded-xl relative overflow-hidden min-h-[160px] flex flex-col justify-between">
              
              {/* Grado romano de fondo (Decorativo) */}
              <span className="absolute -right-2 -bottom-6 text-9xl font-black text-street-dark opacity-40 select-none pointer-events-none">
                {c.grade}
              </span>
              
              <div className="relative z-10">
                  <span className="text-street-accent font-mono text-xs uppercase tracking-widest block mb-2 font-bold bg-street-dark inline-block px-2 py-1 rounded">
                    Grado {c.grade}
                  </span>
                  
                  {/* Nombre del Acorde */}
                  <h2 className="text-4xl font-black text-white group-hover:text-street-accent transition-colors mb-1 break-words">
                    {c.chord}
                  </h2>
                  
                  {/* Tríada */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-street-muted text-xs font-bold uppercase">Tríada:</span>
                    <span className="text-street-text font-bold text-sm bg-street-dark/50 px-2 rounded border border-street-border">
                      {c.triad}
                    </span>
                  </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-street-muted text-xl animate-pulse">Cargando teoría musical...</p>
        </div>
      )}
    </div>
  );
};

export default HarmonizationPage;