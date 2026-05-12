import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera, Float, MeshDistortMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';

const MarrakechPlane = () => {
  const meshRef = useRef();
  
  // High quality Marrakech image as texture
  const texture = useLoader(THREE.TextureLoader, 'https://images.unsplash.com/photo-1548013146-72479768bbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Subtle rotation like the Halide Core effect
    meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.15;
    meshRef.current.rotation.x = -0.5 + Math.cos(time * 0.2) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-0.5, 0.4, 0]}>
      <planeGeometry args={[5, 3.5, 32, 32]} />
      <meshStandardMaterial 
        map={texture} 
        roughness={0.2}
        metalness={0.8}
        emissive={new THREE.Color('#333')}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const MarrakechCard3D = () => {
  return (
    <div className="three-container" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} />

        <React.Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <MarrakechPlane />
          </Float>
        </React.Suspense>

        {/* HUD Overlay in 3D Space */}
        <Html position={[2.5, 1.8, 0]} transform distanceFactor={10}>
          <div style={{ color: '#BC4931', fontFamily: 'monospace', fontSize: '10px', whiteSpace: 'nowrap' }}>
            LATITUDE: 31.6295° N<br />
            ALTITUDE: 466M
          </div>
        </Html>
      </Canvas>
    </div>
  );
};

export default MarrakechCard3D;
