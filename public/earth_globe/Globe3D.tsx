'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

// GLTF Model Component
function EarthModel() {
  const { scene } = useGLTF('/earth_globe/scene.gltf');
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (scene) {
      // Clone the scene to avoid modifying the original
      const clonedScene = scene.clone();
      
      // Calculate bounding box to determine proper scale
      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      // Scale to fit in a 2-unit sphere
      const scale = 2 / maxDim;
      clonedScene.scale.setScalar(scale);
      
      // Center the model
      const center = box.getCenter(new THREE.Vector3());
      clonedScene.position.sub(center.multiplyScalar(scale));
      
      // Apply the cloned scene to the group
      if (groupRef.current) {
        groupRef.current.clear();
        groupRef.current.add(clonedScene);
      }
    }
  }, [scene]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return <group ref={groupRef} />;
}

// Fallback Sphere with green theme
function FallbackEarth() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial 
        color="#10b981"
        roughness={0.2}
        metalness={0.1}
        emissive="#065f46"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

// Main Globe Component
export default function Globe3D() {
  return (
    
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        {/* Enhanced lighting for better visibility */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.0} 
          castShadow 
          color="#ffffff"
        />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#10b981" />
        <pointLight position={[5, -5, 5]} intensity={0.3} color="#059669" />
        <pointLight position={[0, 5, 0]} intensity={0.2} color="#6ee7b7" />
        
        {/* Environment for better reflections */}
        <Environment preset="park" />
        
        {/* Subtle stars with green tint */}
        <Stars 
          radius={80} 
          depth={40} 
          count={2000} 
          factor={3} 
          saturation={0.2} 
          fade 
          speed={0.5}
        />
        
        {/* Earth Model with error boundary */}
        <React.Suspense fallback={<FallbackEarth />}>
          <EarthModel />
        </React.Suspense>
        
        {/* Interactive controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={2}
          maxDistance={8}
          autoRotate={true}
          autoRotateSpeed={0.5}
          dampingFactor={0.05}
          enableDamping={true}
        />
      </Canvas>
 
  );
}

// Preload the model
useGLTF.preload('/earth_globe/scene.gltf');