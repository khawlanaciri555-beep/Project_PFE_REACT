import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="auth-animated-bg" style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      overflow: 'hidden',
      background: 'var(--bg-color, #F8F7F4)',
      transition: 'background 0.5s ease'
    }}>
      {/* Dynamic Gradients */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(188, 73, 49, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />
      
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -80, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(197, 138, 58, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />

      {/* Floating Geometric Elements (Zellige Inspired) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: Math.random() * 100 + 'vw',
            y: Math.random() * 100 + 'vh'
          }}
          animate={{ 
            opacity: [0, 0.15, 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            border: '1.5px solid var(--primary)',
            borderRadius: i % 2 === 0 ? '0' : '50%',
            rotate: '45deg',
            opacity: 0.1,
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* Subtle Grain/Noise Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Zellige Pattern at edges */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '150px',
        backgroundImage: 'url("/background/zlige.png")',
        backgroundSize: '300px',
        opacity: 0.05,
        maskImage: 'linear-gradient(to top, black, transparent)',
        WebkitMaskImage: 'linear-gradient(to top, black, transparent)'
      }} />
    </div>
  );
};

export default AnimatedBackground;
