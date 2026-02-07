import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Efecto cascada (uno tras otro)
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const ModuleCard = ({ to, title, subtitle, number }) => (
  <motion.div variants={itemVariants} className="h-full">
    <Link to={to} className="group relative block h-full bg-void-light border border-white/10 p-8 hover:border-kinetic/50 transition-colors duration-500 overflow-hidden">
      {/* Fondo hover animado */}
      <div className="absolute inset-0 bg-kinetic/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
      
      <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
        <div className="flex justify-between items-start">
          <span className="font-mono text-xs text-ash-dim uppercase tracking-widest group-hover:text-kinetic transition-colors">
            Module_{number}
          </span>
          {/* Icono flecha */}
          <span className="text-ash-dim group-hover:text-kinetic transition-colors text-xl">↗</span>
        </div>
        
        <div>
          <h3 className="font-display text-3xl uppercase text-ash mb-2 group-hover:translate-x-2 transition-transform duration-300">
            {title}
          </h3>
          <p className="font-mono text-xs text-ash-dim uppercase tracking-wider group-hover:text-ash transition-colors">
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  </motion.div>
);

const DynamicHero = () => {
  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative w-full min-h-[85vh] flex flex-col justify-center py-20 px-4 md:px-8 border-b border-white/5"
    >
      {/* --- FONDO DECORATIVO --- */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-kinetic/10 to-transparent blur-[120px] pointer-events-none opacity-20"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
        
        {/* --- IZQUIERDA: IDENTIDAD --- */}
        <div className="lg:col-span-7 space-y-8">
          {/* Etiqueta Superior */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="w-2 h-2 bg-kinetic rounded-full animate-pulse"></div>
            <span className="font-mono text-xs text-kinetic uppercase tracking-[0.3em]">
              System Online v2.0
            </span>
          </motion.div>

          {/* Título Masivo (Logo Textual) */}
          <motion.h1 variants={itemVariants} className="font-display text-7xl md:text-9xl text-ash uppercase leading-[0.85] tracking-tighter">
            LOUD<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ash-dim to-void-light">THEORY</span>
          </motion.h1>

          {/* Descripción */}
          <motion.div variants={itemVariants} className="max-w-xl border-l-2 border-kinetic/30 pl-6 py-2">
            <p className="font-mono text-ash-dim text-sm md:text-base leading-relaxed">
              Plataforma interactiva de teoría musical para mentes autodidactas. 
              Explora la arquitectura del sonido a través de visualización en tiempo real 
              y diseño industrial.
            </p>
          </motion.div>
        </div>

        {/* --- DERECHA: NAV DE ACCESO RÁPIDO --- */}
        <div className="lg:col-span-5 w-full">
           <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
              <ModuleCard 
                to="/" 
                number="01"
                title="Escalas" 
                subtitle="Visualizador & Piano" 
              />
              <ModuleCard 
                to="/armonizacion" 
                number="02"
                title="Armonización" 
                subtitle="Generador de Acordes" 
              />
              <ModuleCard 
                to="/transposicion" 
                number="03"
                title="Transposición" 
                subtitle="Adaptador Instrumental" 
              />
           </motion.div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] text-ash-dim uppercase tracking-widest">Scroll to Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-kinetic to-transparent"></div>
      </motion.div>

    </motion.section>
  );
};

export default DynamicHero;