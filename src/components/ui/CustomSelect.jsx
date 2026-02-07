import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelect = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Cerrar si clicamos fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-[10px] font-mono text-ash-dim uppercase tracking-widest mb-2 ml-1">
          {label}
        </label>
      )}
      
      {/* EL BOTÓN PRINCIPAL */}
      <motion.button
        whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full text-left p-4 bg-void-light border border-white/10 
          flex justify-between items-center group transition-colors duration-300
          ${isOpen ? 'border-kinetic' : 'hover:border-white/30'}
        `}
      >
        <span className="font-display text-xl uppercase text-ash tracking-tight">
          {options.find(opt => opt.value === value)?.label || value}
        </span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-kinetic font-mono text-xs"
        >
          ▼
        </motion.span>
      </motion.button>

      {/* EL MENÚ DESPLEGABLE (ANIMADO) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-1 bg-[#0a0a0a] border border-white/10 shadow-2xl max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ backgroundColor: "rgba(255, 184, 0, 0.1)", x: 5 }}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-3 border-b border-white/5 last:border-0
                  flex items-center gap-3 transition-colors
                `}
              >
                <div className={`w-1 h-1 rounded-full ${value === option.value ? 'bg-kinetic' : 'bg-white/20'}`} />
                <span className={`font-mono text-sm uppercase ${value === option.value ? 'text-kinetic font-bold' : 'text-ash-dim'}`}>
                  {option.label || option.value}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;