import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls, useCreateStore, LevaPanel } from 'leva';
import { Settings } from 'lucide-react';

export const InteractiveOverlappingSpheres = () => {
  const [showControls, setShowControls] = useState(false);
  const store = useCreateStore();
  const controlsRef = useRef<any>(null);

  const { lightIntensity, lightX, lightY, lightZ, sphereColor1, sphereColor2, opacity, showGrid } = useControls('Overlapping Settings', {
    lightIntensity: { value: 2, min: 0, max: 5, label: 'Intensity' },
    lightX: { value: 5, min: -10, max: 10, label: 'Light X' },
    lightY: { value: 5, min: 0, max: 10, label: 'Light Y' },
    lightZ: { value: 5, min: -10, max: 10, label: 'Light Z' },
    sphereColor1: { value: '#4b5563', label: 'Front Color' },
    sphereColor2: { value: '#6b7280', label: 'Back Color' },
    opacity: { value: 1, min: 0.1, max: 1, label: 'Opacity' },
    showGrid: { value: false, label: 'Grid' }
  }, { store });

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enablePan = false;
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.maxPolarAngle = Math.PI / 1.8;
    }
  }, []);

  return (
    <div className="w-full h-[400px] bg-stone-100 rounded-lg overflow-hidden shadow-inner border border-stone-300 relative group touch-none">
      <div className="absolute top-4 left-4 z-10 bg-stone-900/10 backdrop-blur px-3 py-1 rounded-full text-stone-600 text-xs font-bold border border-stone-900/5 pointer-events-none">
        Interactive Depth Reference
      </div>

      <button 
        onClick={() => setShowControls(!showControls)}
        className="absolute top-4 right-4 z-20 bg-stone-900/10 hover:bg-stone-900/20 backdrop-blur p-1.5 rounded-full text-stone-600 transition-colors"
      >
        <Settings size={16} />
      </button>

      <div 
          className={`absolute top-12 right-4 z-20 w-80 shadow-2xl rounded-lg overflow-hidden bg-stone-900 transition-all duration-200 origin-top-right ${
            showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
          onPointerDown={(e) => e.stopPropagation()}
      >
          <LevaPanel 
              store={store} 
              fill 
              flat 
              titleBar={false}
              theme={{
                  colors: {
                      elevation1: '#1c1917',
                      elevation2: '#292524',
                      elevation3: '#44403c',
                      highlight1: '#0ea5e9',
                      highlight2: '#0284c7',
                  }
              }}
          />
      </div>

      <Canvas camera={{ position: [0, 2, 6], fov: 45 }} shadows>
        <color attach="background" args={['#f5f5f4']} />
        
        {/* Grid moved slightly above floor (-1.0) to be visible */}
        {showGrid && <gridHelper args={[20, 20, '#d6d3d1', '#e5e5e5']} position={[0, -0.99, 0]} />}

        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight 
          position={[lightX, lightY, lightZ]} 
          intensity={lightIntensity} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />

        {/* Front Sphere */}
        <mesh position={[-0.5, 0, 1]} castShadow receiveShadow>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial 
            color={sphereColor1} 
            transparent opacity={opacity}
            roughness={0.9} 
            metalness={0.1}
          />
        </mesh>

        {/* Back Sphere */}
        <mesh position={[0.5, 0, -0.5]} castShadow receiveShadow>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial 
            color={sphereColor2} 
            transparent opacity={opacity}
            roughness={0.9} 
            metalness={0.1}
          />
        </mesh>

        {/* Real Floor Plane for shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#f5f5f4" roughness={1} />
        </mesh>

        <OrbitControls 
            ref={controlsRef}
            enableZoom={true}
        />
      </Canvas>
    </div>
  );
};