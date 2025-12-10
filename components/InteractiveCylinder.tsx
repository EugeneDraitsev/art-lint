import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls, useCreateStore, LevaPanel } from 'leva';
import { Settings } from 'lucide-react';

export const InteractiveCylinder = () => {
  const [showControls, setShowControls] = useState(false);
  const store = useCreateStore();
  const controlsRef = useRef<any>(null);

  const { lightIntensity, lightX, lightY, lightZ, cylinderColor, opacity, showGrid } = useControls('Cylinder Settings', {
    lightIntensity: { value: 2, min: 0, max: 5, label: 'Intensity' },
    lightX: { value: 5, min: -10, max: 10, label: 'Light X' },
    lightY: { value: 5, min: 0, max: 20, label: 'Light Y' },
    lightZ: { value: 2, min: -10, max: 20, label: 'Light Z' },
    cylinderColor: { value: '#d6d3d1', label: 'Color' },
    opacity: { value: 1, min: 0, max: 1, label: 'Opacity' },
    showGrid: { value: false, label: 'Grid' }
  }, { store });

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enablePan = false;
      controlsRef.current.maxPolarAngle = Math.PI / 1.8;
    }
  }, []);

  return (
    <div className="w-full h-[500px] bg-stone-100 rounded-lg shadow-inner border border-stone-300 relative group touch-none">
      <div className="absolute top-4 left-4 z-10 bg-stone-900/10 backdrop-blur px-3 py-1 rounded-full text-stone-600 text-xs font-bold border border-stone-900/5 pointer-events-none">
        Curved Surface Reference
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

      <div className="w-full h-full overflow-hidden rounded-lg">
        <Canvas camera={{ position: [0, 4, 6], fov: 35 }} shadows>
            <color attach="background" args={['#f5f5f4']} />
            
            {/* Grid moved slightly above floor (-0.4) to be visible */}
            {showGrid && <gridHelper args={[10, 10, '#d6d3d1', '#e5e5e5']} position={[0, -0.39, 0]} />}

            <ambientLight intensity={0.5} />
            <directionalLight 
            position={[lightX, lightY, lightZ]} 
            intensity={lightIntensity} 
            castShadow 
            />

            <mesh position={[0, 0, 0]} castShadow receiveShadow>
            {/* Flattened cylinder to look more like the reference (puck shape) */}
            <cylinderGeometry args={[1.8, 1.8, 0.8, 64]} />
            <meshStandardMaterial 
                color={cylinderColor} 
                transparent 
                opacity={opacity}
                roughness={0.5}
                metalness={0.1}
            />
            </mesh>

            {/* Real Floor Plane for shadows */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#f5f5f4" roughness={1} />
            </mesh>

            <OrbitControls 
                ref={controlsRef}
                enableZoom={true}
            />
        </Canvas>
      </div>
    </div>
  );
};