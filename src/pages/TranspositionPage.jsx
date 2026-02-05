import React, { useState } from 'react';
import { Note, Interval } from '@tonaljs/tonal';
import BrassVisualizer from '../components/BrassVisualizer'; // <--- IMPORTANTE

const INSTRUMENTS_DATA = [
  { name: 'Instrumento en C (Piano, Flauta, Violín)', semitones: 0, type: 'chromatic' },
  { name: 'Trompeta (Bb)', semitones: -2, type: 'brass' },
  { name: 'Corno Francés (F)', semitones: -7, type: 'brass' },
  { name: 'Saxo Alto (Eb)', semitones: -9, type: 'woodwind' },
  { name: 'Fagot / Bassoon (C)', semitones: 0, type: 'woodwind' }, // Fagot lee en C pero clave de Fa
  { name: 'Clarinete (Bb)', semitones: -2, type: 'woodwind' },
];

const TranspositionPage = () => {
  // --- ESTADO SECCIÓN 1 ---
  const [concertNote, setConcertNote] = useState('C4'); // Usamos notas con octava (C4) para que la lógica funcione mejor
  const [instIdx1, setInstIdx1] = useState(1);

  // --- ESTADO SECCIÓN 2 ---
  const [scoreInstIdx, setScoreInstIdx] = useState(1);
  const [myInstIdx, setMyInstIdx] = useState(0);

  // --- CÁLCULOS SECCIÓN 1 ---
  const targetInst1 = INSTRUMENTS_DATA[instIdx1];
  const interval1 = Interval.fromSemitones(targetInst1.semitones * -1); 
  const writtenNote1 = Note.transpose(concertNote, interval1);

  // --- CÁLCULOS SECCIÓN 2 ---
  const scoreInst = INSTRUMENTS_DATA[scoreInstIdx];
  const myInst = INSTRUMENTS_DATA[myInstIdx];
  let diff = scoreInst.semitones - myInst.semitones;
  
  const direction = diff > 0 ? "SUBIR" : diff < 0 ? "BAJAR" : "MANTENER";
  const absDiff = Math.abs(diff);
  const tones = Math.floor(absDiff / 2);
  const semi = absDiff % 2; 

  let amountText = "";
  if (absDiff === 0) amountText = "Nada (Lee igual)";
  else {
    amountText += `${absDiff} semitonos`;
    amountText += ` (${tones > 0 ? tones + ' tono' + (tones > 1 ? 's' : '') : ''}`;
    amountText += `${tones > 0 && semi ? ' y ' : ''}`;
    amountText += `${semi ? 'medio' : ''})`;
  }

  // Generamos lista de notas con octavas para el selector (C3 a C6)
  const OCTAVE_NOTES = [];
  ['3', '4', '5'].forEach(oct => {
    ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'].forEach(n => OCTAVE_NOTES.push(n + oct));
  });

  return (
    <div className="space-y-16 animate-fade-in max-w-5xl mx-auto pb-20">
      
      {/* ================= SECCIÓN 1 ================= */}
      <section>
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl text-white mb-2 uppercase drop-shadow-[4px_4px_0px_rgba(234,179,8,0.2)]">
            Transposición
          </h1>
          <p className="text-street-muted font-bold tracking-widest uppercase text-sm">
            Herramientas para adaptar tu instrumento
          </p>
        </header>

        <div className="bg-street-card border-2 border-street-border p-8 rounded-xl shadow-hard relative overflow-hidden">
          
          <h3 className="text-street-text font-black uppercase text-xl mb-6 flex items-center gap-2">
            <span className="text-street-accent text-2xl">1.</span> Quiero que suene...
          </h3>

          <div className="flex flex-col md:flex-row items-start justify-center gap-8">
            <div className="text-center w-full md:w-1/3">
              <label className="block text-street-muted uppercase font-bold text-xs mb-2">Nota Real (Concert)</label>
              <select 
                value={concertNote} 
                onChange={e => setConcertNote(e.target.value)}
                className="w-full text-center text-4xl font-black bg-street-dark text-white border-2 border-street-muted focus:border-street-accent outline-none p-4 rounded-lg appearance-none cursor-pointer"
              >
                {OCTAVE_NOTES.map(n => (
                  <option key={n} value={n} className="bg-street-dark text-base">{n}</option>
                ))}
              </select>
            </div>

            <div className="hidden md:block text-street-accent text-4xl font-black self-center">➜</div>

            <div className="text-center w-full md:w-1/3">
              <label className="block text-street-muted uppercase font-bold text-xs mb-2">Mi Instrumento</label>
              <select 
                className="w-full bg-street-dark text-white p-3 mb-4 border-2 border-street-muted font-bold rounded-lg outline-none focus:border-street-accent uppercase text-sm"
                onChange={(e) => setInstIdx1(e.target.value)}
                value={instIdx1}
              >
                {INSTRUMENTS_DATA.map((inst, i) => (
                  <option key={i} value={i} className="bg-street-dark">{inst.name}</option>
                ))}
              </select>
              
              <div className="bg-street-dark p-4 border border-street-muted rounded-lg mb-4">
                <p className="text-street-muted text-xs uppercase font-bold mb-1">Debes Leer:</p>
                <p className="text-5xl font-black text-white">{Note.simplify(writtenNote1)}</p>
              </div>

              {/* --- AQUÍ INSERTAMOS EL VISOR DE PISTONES SI ES METAL --- */}
              {targetInst1.type === 'brass' && (
                <BrassVisualizer 
                    note={writtenNote1} 
                    instrumentName={targetInst1.name} 
                />
              )}

              {/* Mensaje para maderas */}
              {targetInst1.type === 'woodwind' && (
                 <div className="mt-4 p-3 bg-[#111] rounded border border-street-border text-xs text-street-muted italic">
                    * Para ver la posición de llaves de {targetInst1.name.split('(')[0]}, consulta tu tabla de digitación (demasiado compleja para mostrar aquí).
                 </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECCIÓN 2 (Guía de Lectura) ================= */}
      <section>
        <div className="bg-street-dark border-2 border-street-accent p-8 rounded-xl shadow-[0_0_40px_rgba(234,179,8,0.1)] relative">
           <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-street-accent text-street-dark font-black px-6 py-2 uppercase tracking-widest border-4 border-street-dark rounded-full shadow-lg whitespace-nowrap">
            ★ Guía de Lectura
          </div>

          <h3 className="text-center text-street-muted font-bold uppercase text-sm mt-6 mb-8">
            Adaptar partituras ajenas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-6">
              <div>
                <label className="text-street-text font-black uppercase text-sm block mb-2">1. Partitura de:</label>
                <select 
                  className="w-full bg-street-card text-white p-4 border-2 border-street-border focus:border-street-accent outline-none rounded-lg font-bold"
                  value={scoreInstIdx}
                  onChange={e => setScoreInstIdx(e.target.value)}
                >
                   {INSTRUMENTS_DATA.map((inst, i) => (
                    <option key={i} value={i} className="bg-street-dark">{inst.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-street-accent font-black uppercase text-sm block mb-2">2. Yo toco:</label>
                <select 
                  className="w-full bg-street-card text-street-accent p-4 border-2 border-street-accent outline-none rounded-lg font-bold shadow-hard-sm"
                  value={myInstIdx}
                  onChange={e => setMyInstIdx(e.target.value)}
                >
                   {INSTRUMENTS_DATA.map((inst, i) => (
                    <option key={i} value={i} className="bg-street-dark">{inst.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-street-card border-2 border-street-border p-8 rounded-xl text-center flex flex-col justify-center h-full min-h-[200px]">
              <p className="text-street-muted text-xs font-bold uppercase tracking-widest mb-4">Acción Requerida</p>
              
              <div className="flex items-center justify-center gap-4 mb-2">
                <h2 className={`text-4xl md:text-5xl font-black ${direction === 'MANTENER' ? 'text-street-muted' : 'text-white'}`}>
                  {direction}
                </h2>
              </div>

              <div className="bg-street-dark inline-block mx-auto px-6 py-2 rounded-full border border-street-border mt-2">
                <span className="text-street-accent font-mono font-bold text-lg">
                  {amountText}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default TranspositionPage;