import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls, useCreateStore, LevaPanel } from 'leva';
import { Settings } from 'lucide-react';

export const InteractiveAdvancedSpheres = () => {
  const [showControls, setShowControls] = useState(false);
  const store = useCreateStore();
  const controlsRef = useRef<any>(null);

  const { lightIntensity, lightX, lightY, lightZ, baseColor, showGrid } = useControls('Pyramid Settings', {
    lightIntensity: { value: 2.2, min: 0, max: 5, label: 'Intensity' },
    lightX: { value: 5, min: -10, max: 10, label: 'Light X' },
    lightY: { value: 8, min: 0, max: 15, label: 'Light Y' },
    lightZ: { value: 5, min: -10, max: 10, label: 'Light Z' },
    baseColor: { value: '#9ca3af', label: 'Color' },
    showGrid: { value: false, label: 'Grid' }
  }, { store });

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enablePan = false;
      controlsRef.current.maxPolarAngle = Math.PI / 1.9;
    }
  }, []);

  return (
    <div className="w-full h-[400px] bg-stone-100 rounded-lg overflow-hidden shadow-inner border border-stone-300 relative group touch-none">
      <div className="absolute top-4 left-4 z-10 bg-stone-900/10 backdrop-blur px-3 py-1 rounded-full text-stone-600 text-xs font-bold border border-stone-900/5 pointer-events-none">
        Sphere Cluster Reference
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

      <Canvas camera={{ position: [0, 4, 8], fov: 40 }} shadows>
        <color attach="background" args={['#f5f5f4']} />
        
        {/* Grid moved slightly above floor (0) to be visible */}
        {showGrid && <gridHelper args={[20, 20, '#d6d3d1', '#e5e5e5']} position={[0, 0.01, 0]} />}

        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[lightX, lightY, lightZ]} 
          intensity={lightIntensity} 
          castShadow 
          shadow-bias={-0.0001}
        />

        <group position={[0, 1, 0]}>
            {/* Bottom Row */}
            <mesh position={[-1.1, 0, 1.1]} castShadow receiveShadow>
                <sphereGeometry args={[1, 48, 48]} />
                <meshStandardMaterial color={baseColor} roughness={0.8} />
            </mesh>
            <mesh position={[1.1, 0, 1.1]} castShadow receiveShadow>
                <sphereGeometry args={[1, 48, 48]} />
                <meshStandardMaterial color={baseColor} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0, -0.9]} castShadow receiveShadow>
                <sphereGeometry args={[1, 48, 48]} />
                <meshStandardMaterial color={baseColor} roughness={0.8} />
            </mesh>

            {/* Top Sphere */}
            <mesh position={[0, 1.6, 0.4]} castShadow receiveShadow>
                <sphereGeometry args={[1, 48, 48]} />
                <meshStandardMaterial color={baseColor} roughness={0.8} />
            </mesh>
        </group>

        {/* Real Floor Plane for shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
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