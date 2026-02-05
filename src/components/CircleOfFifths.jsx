import React from 'react';
import { Note } from '@tonaljs/tonal';

const positions = [
  { note: 'C', label: 'C', angle: -90, keySig: '0' },
  { note: 'G', label: 'G', angle: -60, keySig: '1#' },
  { note: 'D', label: 'D', angle: -30, keySig: '2#' },
  { note: 'A', label: 'A', angle: 0, keySig: '3#' },
  { note: 'E', label: 'E', angle: 30, keySig: '4#' },
  { note: 'B', label: 'B', angle: 60, keySig: '5#' },
  { note: 'F#', label: 'F#/Gb', angle: 90, keySig: '6' },
  { note: 'Db', label: 'Db', angle: 120, keySig: '5b' },
  { note: 'Ab', label: 'Ab', angle: 150, keySig: '4b' },
  { note: 'Eb', label: 'Eb', angle: 180, keySig: '3b' },
  { note: 'Bb', label: 'Bb', angle: 210, keySig: '2b' },
  { note: 'F', label: 'F', angle: 240, keySig: '1b' },
];

const getCoordinatesForAngle = (angleDegrees, radius, center) => {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(angleRadians),
    y: center + radius * Math.sin(angleRadians)
  };
};

const CircleOfFifths = ({ currentRoot, onRootChange }) => {
  const size = 320;
  const center = size / 2;
  const labelRadius = 120; 

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto block select-none">
      {/* Anillos decorativos */}
      <circle cx={center} cy={center} r={labelRadius + 25} fill="none" stroke="#333" strokeWidth="2" />
      <circle cx={center} cy={center} r={labelRadius - 35} fill="none" stroke="#EAB308" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />

      {positions.map((pos) => {
        const { x, y } = getCoordinatesForAngle(pos.angle, labelRadius, center);
        // Comparar tónica actual con la posición
        const isActive = Note.enharmonic(currentRoot) === Note.enharmonic(pos.note);

        return (
          <g 
            key={pos.note} 
            onClick={() => onRootChange(pos.note)} 
            className="cursor-pointer transition-all duration-300 group"
          >
            {/* Círculo indicador de selección */}
            <circle 
              cx={x} cy={y} r={28} 
              className={`transition-all duration-300 ${isActive ? 'fill-street-accent stroke-street-dark stroke-4' : 'fill-street-card stroke-street-border hover:fill-street-muted'}`}
            />
            
            {/* Nombre de la nota */}
            <text 
              x={x} y={y} dy="1"
              textAnchor="middle" alignmentBaseline="middle" 
              className={`text-sm font-black uppercase ${isActive ? 'fill-street-dark' : 'fill-street-text'}`}
            >
              {pos.label}
            </text>

             {/* Número de alteraciones (pequeño abajo) */}
             <text x={x} y={y + 14} textAnchor="middle" fontSize="10" className={isActive ? 'fill-street-dark font-bold' : 'fill-street-muted'}>
                {pos.keySig}
            </text>
          </g>
        );
      })}
      
      {/* Texto central */}
      <text x={center} y={center} textAnchor="middle" alignmentBaseline="middle" className="fill-street-muted font-bold tracking-widest uppercase text-xs">
         Quintas
      </text>
    </svg>
  );
};

export default CircleOfFifths;