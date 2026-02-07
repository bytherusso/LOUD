import React from 'react';
import { motion } from 'framer-motion';
import logoHero from '../assets/HERO CENTER.svg';

const Hero = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center bg-void overflow-hidden border-b border-black/10">
      
      {/* Grilla de fondo sutil */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-10">
        
        {/* LOGO CENTRAL */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <img 
            src={logoHero} 
            alt="LOUD Hero Logo" 
            // w-72 (móvil) y w-[500px] (pantallas grandes)
            className="w-72 md:w-[500px] h-auto object-contain drop-shadow-xl" 
        />
        </motion.div>

        {/* EL NUEVO ESLOGAN (Tipografía Gigante) */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="font-display text-6xl md:text-8xl uppercase text-ash leading-[0.85] tracking-tighter">
            Del Caos<br/>
            <span className="text-kinetic">A la Música.</span>
          </h1>
          
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="h-16 w-px bg-kinetic"></div>
            <p className="font-mono text-sm md:text-base text-ash-dim leading-relaxed bg-white/60 backdrop-blur-sm p-6 border border-black/5 max-w-xl">
              Siempre hay algo nuevo por aprender. LOUD simplifica la teoría para
              que resuelvas esas dudas que te frenan,
              sin importar si estás empezando o si llevas años tocando
            </p>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
           <div className="flex flex-col items-center gap-2">
             <span className="font-mono text-[9px] uppercase tracking-widest text-kinetic animate-pulse">
               Inicio
             </span>
             <div className="w-px h-12 bg-gradient-to-b from-kinetic to-transparent"></div>
           </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;