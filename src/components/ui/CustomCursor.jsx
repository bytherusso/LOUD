import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Detectar elementos interactivos
      const target = e.target;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('a') || 
        target.closest('button') ||
        target.tagName === 'SELECT' ||
        target.tagName === 'INPUT' ||
        target.classList.contains('cursor-pointer');

      setIsHovering(isInteractive);
    };

    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  // No renderizar en móviles (táctil)
  if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    return null; 
  }

  return (
    <>
      {/* PUNTO PRINCIPAL (Rojo Kinetic) */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-kinetic rounded-full pointer-events-none z-[100] mix-blend-multiply"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          // Se agranda al hacer hover, pero ya no muestra texto
          scale: isHovering ? 4 : 1, 
          opacity: isHovering ? 0.5 : 1
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      
      {/* (ELIMINADO) El bloque del texto "OPEN" se ha quitado de aquí */}
    </>
  );
};

export default CustomCursor;