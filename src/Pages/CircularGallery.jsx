import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Image, ScrollControls, useScroll, Text, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader to apply a cylindrical bend to the planes
const BendMaterial = shaderMaterial(
  { uTexture: null, uBend: 1.0, uRadius: 10.0 },
  // vertex shader
  `
  varying vec2 vUv;
  uniform float uBend;
  uniform float uRadius;
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Applying bend based on uBend
    float angle = pos.x / uRadius * uBend;
    pos.z += (1.0 - cos(angle)) * uRadius;
    pos.x = sin(angle) * uRadius;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // fragment shader
  `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  void main() {
    vec4 tex = texture2D(uTexture, vUv);
    gl_FragColor = tex;
  }
  `
);

extend({ BendMaterial });

const IMAGE_WIDTH = 5;
const IMAGE_HEIGHT = 6.5;
const RADIUS = 11;

function GalleryImage({ url, title, index, count, bend, borderRadius, textColor }) {
  const ref = useRef();
  const textRef = useRef();
  
  const angle = (index / count) * Math.PI * 2;
  const x = Math.sin(angle) * RADIUS;
  const z = Math.cos(angle) * RADIUS;

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.lookAt(0, 0, 0);
    if (textRef.current) textRef.current.lookAt(0, 0, 0);
  });

  return (
    <group position={[x, 0, z]}>
      <Image
        ref={ref}
        url={url}
        scale={[IMAGE_WIDTH, IMAGE_HEIGHT]}
        transparent
        opacity={1}
        radius={borderRadius}
        segments={20} // Important for the bend shader to have vertices to work with
      />
      <Text
        ref={textRef}
        position={[0, -IMAGE_HEIGHT/2 - 0.7, 0.2]}
        fontSize={0.45}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/outfit/v11/Q3pb7p-084WS_re7WJ6U.woff"
      >
        {title.toUpperCase()}
      </Text>
    </group>
  );
}

function Rig({ children, scrollSpeed, scrollEase }) {
  const group = useRef();
  const scroll = useScroll();
  
  useFrame((state, delta) => {
    if (!group.current) return;
    const targetRotation = scroll.offset * Math.PI * 2;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -targetRotation * scrollSpeed, scrollEase);
  });

  return <group ref={group}>{children}</group>;
}

const CircularGallery = ({ 
  bend = 1, 
  textColor = "#ffffff", 
  borderRadius = 0.05, 
  scrollSpeed = 2, 
  scrollEase = 0.05 
}) => {
  const items = useMemo(() => [
    { title: "Mosquée Koutoubia", url: "https://images.unsplash.com/photo-1587974928442-7bd927f1fbff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Palais de la Bahia", url: "https://images.unsplash.com/photo-1549429141-8f553f1f7ca4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Les Souks", url: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Jardin Majorelle", url: "https://images.unsplash.com/photo-1590089849504-20412e106da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Place Jemaa el-Fna", url: "https://images.unsplash.com/photo-1548013146-72479768bbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Désert d'Agafay", url: "https://images.unsplash.com/photo-1598967069123-5e744a569a7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Musée de Marrakech", url: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
  ], []);

  return (
    <div style={{ width: '100%', height: '100%', cursor: 'grab', background: 'transparent' }}>
      <Canvas camera={{ position: [0, 0, 18], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={1} />
        <pointLight position={[0, 10, 10]} intensity={1.5} />
        
        <ScrollControls pages={3} damping={0.1} horizontal={false}>
          <Rig scrollSpeed={scrollSpeed} scrollEase={scrollEase}>
            {items.map((item, index) => (
              <GalleryImage 
                key={index} 
                url={item.url} 
                title={item.title}
                index={index} 
                count={items.length} 
                bend={bend}
                borderRadius={borderRadius}
                textColor={textColor}
              />
            ))}
          </Rig>
        </ScrollControls>
      </Canvas>
    </div>
  );
};

export default CircularGallery;
