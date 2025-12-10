import React from 'react';

// Common styles for the 'hand-drawn' look
const strokeStyle = "stroke-gray-800 stroke-2";
const guideStyle = "stroke-indigo-400 stroke-1 stroke-dasharray-4";
const fillStyle = "fill-white";

// Helper for grid background
const GridBackground = () => (
  <>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </>
);

// --- LESSON 1: THE SPHERE STEPS ---

export const SphereStep1 = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-white rounded-lg">
    <GridBackground />
    <circle cx="200" cy="150" r="80" fill="none" stroke="#374151" strokeWidth="3" />
    <text x="200" y="260" textAnchor="middle" className="text-sm fill-gray-500 font-mono">STEP 1: THE CIRCLE</text>
  </svg>
);

export const SphereStep2 = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-white rounded-lg">
    <GridBackground />
    {/* Sun Icon */}
    <g transform="translate(320, 40)">
      <circle cx="0" cy="0" r="15" fill="#fbbf24" />
      <g stroke="#fbbf24" strokeWidth="2">
        <line x1="0" y1="-25" x2="0" y2="-18" />
        <line x1="0" y1="25" x2="0" y2="18" />
        <line x1="-25" y1="0" x2="-18" y2="0" />
        <line x1="25" y1="0" x2="18" y2="0" />
        <line x1="18" y1="18" x2="12" y2="12" />
        <line x1="-18" y1="-18" x2="-12" y2="-12" />
        <line x1="18" y1="-18" x2="12" y2="-12" />
        <line x1="-18" y1="18" x2="-12" y2="12" />
      </g>
    </g>
    <circle cx="200" cy="150" r="80" fill="none" stroke="#374151" strokeWidth="3" />
    {/* Light direction arrow */}
    <path d="M 300 60 L 260 90" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="5 5" />
    <text x="200" y="260" textAnchor="middle" className="text-sm fill-gray-500 font-mono">STEP 2: LIGHT SOURCE</text>
  </svg>
);

export const SphereStep3 = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-white rounded-lg">
    <GridBackground />
    <g transform="translate(320, 40)">
      <circle cx="0" cy="0" r="10" fill="#fbbf24" opacity="0.5" />
    </g>
    {/* Cast Shadow */}
    <ellipse cx="160" cy="230" rx="100" ry="20" fill="#e5e7eb" />
    <circle cx="200" cy="150" r="80" fill="white" stroke="#374151" strokeWidth="3" />
    <text x="200" y="280" textAnchor="middle" className="text-sm fill-gray-500 font-mono">STEP 3: CAST SHADOW</text>
  </svg>
);

export const SphereStep4 = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-white rounded-lg">
    <GridBackground />
    <defs>
      {/* Hatching Pattern for rough shading */}
      <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="2" height="4" transform="translate(0,0)" fill="#9ca3af" />
      </pattern>
      <mask id="sphereMask">
        <circle cx="200" cy="150" r="78" fill="white" />
      </mask>
    </defs>
    
    <ellipse cx="160" cy="230" rx="100" ry="20" fill="#e5e7eb" />
    
    <g>
        <circle cx="200" cy="150" r="80" fill="white" stroke="#374151" strokeWidth="3" />
        {/* Core Shadow Area */}
        <circle cx="180" cy="170" r="70" fill="url(#hatch)" mask="url(#sphereMask)" opacity="0.5" />
        {/* Highlight Area (Clean) */}
        <circle cx="240" cy="110" r="30" fill="white" />
    </g>
    
    <text x="200" y="280" textAnchor="middle" className="text-sm fill-gray-500 font-mono">STEP 4: ROUGH SHADING</text>
  </svg>
);

export const SphereStep5 = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-white rounded-lg">
    <GridBackground />
    <defs>
      <radialGradient id="finalSphereGrad" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="white" />
        <stop offset="30%" stopColor="#f3f4f6" />
        <stop offset="70%" stopColor="#4b5563" />
        <stop offset="100%" stopColor="#1f2937" />
      </radialGradient>
      <filter id="blurShadow">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
      </filter>
    </defs>
    
    {/* Blurry Cast Shadow */}
    <ellipse cx="160" cy="230" rx="100" ry="20" fill="#374151" opacity="0.4" filter="url(#blurShadow)" />
    
    {/* Final Sphere */}
    <circle cx="200" cy="150" r="80" fill="url(#finalSphereGrad)" stroke="none" />
    
    <text x="200" y="280" textAnchor="middle" className="text-sm fill-gray-500 font-mono">STEP 5: BLENDED RESULT</text>
  </svg>
);


// --- EXISTING DIAGRAMS ---

export const OverlapDiagram = () => (
  <svg viewBox="0 0 500 300" className="w-full h-full bg-white rounded-lg">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#6366f1" />
      </marker>
    </defs>
    <GridBackground />

    <g transform="translate(250, 50)">
      <text x="60" y="-20" className="text-xs font-mono fill-green-600">DEPTH (OVERLAP)</text>
      <circle cx="110" cy="50" r="25" className={`${strokeStyle} fill-gray-200`} />
      <circle cx="70" cy="80" r="40" className={`${strokeStyle} fill-white`} />
      <path d="M 120 50 L 160 50" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="170" y="55" className="text-xs fill-indigo-600 font-bold">BEHIND</text>
    </g>

    <g transform="translate(150, 200)">
        <text x="0" y="80" className="text-xs font-mono fill-gray-500">EXERCISE: THE CLUSTER</text>
        <circle cx="0" cy="0" r="20" className={`${strokeStyle} fill-gray-300`} />
        <circle cx="40" cy="-10" r="25" className={`${strokeStyle} fill-gray-200`} />
        <circle cx="-30" cy="20" r="30" className={`${strokeStyle} fill-white`} />
        <circle cx="20" cy="30" r="35" className={`${strokeStyle} fill-white`} />
    </g>
  </svg>
);

export const ShadingDiagram = () => (
  <svg viewBox="0 0 500 300" className="w-full h-full bg-white rounded-lg">
    <defs>
      <radialGradient id="sphereGradient" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="white" />
        <stop offset="40%" stopColor="#e5e7eb" />
        <stop offset="80%" stopColor="#4b5563" />
        <stop offset="100%" stopColor="#1f2937" />
      </radialGradient>
    </defs>

    <g transform="translate(400, 50)">
       <circle r="15" fill="#fbbf24" />
       <line x1="-20" y1="20" x2="-60" y2="60" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" />
       <text x="-10" y="-20" className="text-xs font-bold fill-gray-600">LIGHT SOURCE</text>
    </g>

    <g transform="translate(200, 150)">
        <ellipse cx="-40" cy="60" rx="90" ry="20" fill="#000000" opacity="0.2" transform="rotate(-10)" />
        <circle r="80" fill="url(#sphereGradient)" stroke="none" />
        <line x1="-30" y1="-30" x2="-100" y2="-80" stroke="#6366f1" strokeWidth="1" />
        <text x="-150" y="-85" className="text-xs fill-indigo-600">1. Highlight</text>
        <line x1="20" y1="40" x2="100" y2="40" stroke="#6366f1" strokeWidth="1" />
        <text x="110" y="45" className="text-xs fill-indigo-600">2. Core Shadow</text>
        <line x1="-80" y1="80" x2="-120" y2="100" stroke="#6366f1" strokeWidth="1" />
        <text x="-180" y="110" className="text-xs fill-indigo-600">Cast Shadow</text>
    </g>
  </svg>
);

export const CubeDiagram = () => (
  <svg viewBox="0 0 500 300" className="w-full h-full bg-white rounded-lg">
    <g transform="translate(250, 150)">
        <path d="M0,0 L0,80" className="stroke-red-500 stroke-2" strokeDasharray="5 5" />
        <path d="M0,0 L-60,-40" className="stroke-red-500 stroke-2" strokeDasharray="5 5" />
        <path d="M0,0 L60,-30" className="stroke-red-500 stroke-2" strokeDasharray="5 5" />
        
        <text x="10" y="40" className="text-xs fill-red-500 font-bold">1. Vertical Edge</text>

        <g transform="translate(-150, -50)">
             <path d="M-60,-40 L0,-70 L60,-30" className="stroke-gray-300 stroke-1" fill="none" />
             <path d="M0,-70 L0,10" className="stroke-gray-300 stroke-1" fill="none" />
             <path d="M0,0 L0,80" className="stroke-gray-800 stroke-2" fill="none" />
             <path d="M0,0 L-60,-40" className="stroke-gray-800 stroke-2" fill="none" />
             <path d="M0,0 L60,-30" className="stroke-gray-800 stroke-2" fill="none" />
             <path d="M-60,-40 L-60,40 L0,80" className="stroke-gray-800 stroke-2" fill="none" />
             <path d="M60,-30 L60,50 L0,80" className="stroke-gray-800 stroke-2" fill="none" />
             <path d="M-60,-40 L0,-70 L60,-30" className="stroke-gray-800 stroke-2 fill-indigo-50" fillOpacity="0.2" />
        </g>
    </g>
    <text x="20" y="280" className="text-sm fill-gray-500">Left: The 'Y' Construction. Right: Completed Cube.</text>
  </svg>
);

export const HollowCubeDiagram = () => (
  <svg viewBox="0 0 500 300" className="w-full h-full bg-white rounded-lg">
    <g transform="translate(150, 100)">
        <rect x="0" y="0" width="120" height="120" className="stroke-gray-800 stroke-2 fill-none" />
        <path d="M120,0 L160,-30 L160,90 L120,120" className="stroke-gray-800 stroke-2 fill-gray-100" />
        <path d="M0,0 L40,-30 L160,-30" className="stroke-gray-800 stroke-2 fill-gray-50" />
        <rect x="15" y="15" width="90" height="90" className="stroke-gray-800 stroke-2 fill-none" />
        <path d="M105,105 L125,90" className="stroke-indigo-500 stroke-2" />
        <path d="M15,105 L55,75" className="stroke-gray-400 stroke-1 dashed" /> 
        <path d="M105,15 L125,-5 L125,90 L105,105" className="stroke-none fill-gray-800" opacity="0.1" />
        <path d="M120,0 L120,120 L105,105 L105,15 L15,15 L0,0" className="fill-indigo-100" opacity="0.5" />
        <text x="180" y="60" className="text-sm fill-indigo-600 font-bold">← The Rim</text>
    </g>
  </svg>
);

export const TableDiagram = () => (
  <svg viewBox="0 0 500 300" className="w-full h-full bg-white rounded-lg">
    <g transform="translate(180, 80)">
        <path d="M0,40 L120,0 L240,40 L120,80 Z" className="stroke-gray-800 stroke-2 fill-gray-50" />
        <path d="M0,40 L120,80 L240,40 L240,50 L120,90 L0,50 Z" className="stroke-gray-800 stroke-2 fill-gray-200" />
        <path d="M10,48 L10,180 L25,185 L25,53" className="stroke-gray-800 stroke-2 fill-white" />
        <path d="M220,48 L220,180 L205,185 L205,53" className="stroke-gray-800 stroke-2 fill-white" />
        <path d="M110,88 L110,220 L130,215 L130,83" className="stroke-gray-800 stroke-2 fill-white" />
        <line x1="10" y1="180" x2="110" y2="220" className="stroke-indigo-300 stroke-1" strokeDasharray="4 4" />
        <line x1="110" y1="220" x2="220" y2="180" className="stroke-indigo-300 stroke-1" strokeDasharray="4 4" />
        <text x="-50" y="20" className="text-xs fill-gray-400 font-mono">FORESHORTENED SURFACE</text>
    </g>
  </svg>
);

export const StructureDiagram = () => (
  <svg viewBox="0 0 500 300" className="w-full h-full bg-white rounded-lg">
    <g transform="translate(150, 120)">
        <path d="M0,0 L0,100" className="stroke-gray-800 stroke-2" />
        <path d="M80,-30 L80,70" className="stroke-gray-800 stroke-2" />
        <path d="M-60,-30 L-60,70" className="stroke-gray-800 stroke-2" />
        <path d="M-60,70 L0,100 L80,70" className="stroke-gray-800 stroke-2 fill-none" />
        <path d="M-60,-30 L0,0 L80,-30" className="stroke-gray-800 stroke-2 fill-none" />
        <path d="M0,-100 L-60,-30" className="stroke-gray-800 stroke-2 fill-none" />
        <path d="M0,-100 L80,-30" className="stroke-gray-800 stroke-2 fill-none" />
        <path d="M0,-100 L0,0" className="stroke-gray-800 stroke-2 fill-none" />
        <path d="M0,0 L0,100 L80,70 L80,-30 Z" className="fill-gray-100" opacity="0.5" />
        <path d="M0,-100 L0,0 L80,-30 Z" className="fill-gray-200" opacity="0.5" />
        <text x="-120" y="-80" className="text-xs fill-indigo-600 font-bold">COMBINING SHAPES</text>
    </g>
  </svg>
);

export const DensityDiagram = () => (
  <svg viewBox="0 0 500 300" className="w-full h-full bg-white rounded-lg overflow-hidden">
    <GridBackground />
    {/* Horizon Line */}
    <line x1="0" y1="100" x2="500" y2="100" className="stroke-indigo-300 stroke-1" />
    <text x="10" y="90" className="text-xs fill-indigo-400">HORIZON LINE</text>
    
    {/* Background Spheres (Small) */}
    <g transform="translate(0, 110)">
      {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440].map(x => (
         <circle key={x} cx={x + Math.random()*20} cy={Math.random()*10} r={5} className="fill-gray-300 stroke-gray-400 stroke-1" />
      ))}
    </g>

    {/* Midground Spheres (Medium) */}
    <g transform="translate(50, 150)">
       <circle cx="0" cy="0" r="15" className="fill-gray-200 stroke-gray-600 stroke-1" />
       <circle cx="100" cy="10" r="18" className="fill-gray-200 stroke-gray-600 stroke-1" />
       <circle cx="200" cy="-5" r="12" className="fill-gray-200 stroke-gray-600 stroke-1" />
       <circle cx="300" cy="5" r="16" className="fill-gray-200 stroke-gray-600 stroke-1" />
    </g>

    {/* Foreground Spheres (Large) */}
    <g transform="translate(100, 220)">
        <circle cx="0" cy="20" r="40" className="fill-white stroke-gray-800 stroke-2" />
        <circle cx="250" cy="30" r="50" className="fill-white stroke-gray-800 stroke-2" />
    </g>
    
    <text x="20" y="280" className="text-xs fill-gray-500">LARGE (CLOSE)</text>
    <text x="20" y="140" className="text-xs fill-gray-400">SMALL (FAR)</text>
  </svg>
);

export const KoalaDiagram = () => (
    <svg viewBox="0 0 500 300" className="w-full h-full bg-white rounded-lg">
      <GridBackground />
      <g transform="translate(250, 150)">
          {/* Tree Cylinder */}
          <path d="M-60,-140 L-60,140" className="stroke-gray-300 stroke-2" />
          <path d="M60,-140 L60,140" className="stroke-gray-300 stroke-2" />
          <ellipse cx="0" cy="-140" rx="60" ry="10" className="stroke-gray-300 stroke-1 fill-none" />
          <ellipse cx="0" cy="140" rx="60" ry="10" className="stroke-gray-300 stroke-1 fill-none" />

          {/* Koala Construction */}
          <g transform="translate(40, -20)">
             {/* Head */}
             <circle cx="0" cy="0" r="45" className="stroke-indigo-500 stroke-2 fill-white" fillOpacity="0.8" />
             {/* Crosshairs on face */}
             <path d="M-45,0 C-20,10 20,10 45,0" className="stroke-indigo-300 stroke-1 dashed" strokeDasharray="4 2"/>
             <path d="M0,-45 C10,-20 10,20 0,45" className="stroke-indigo-300 stroke-1 dashed" strokeDasharray="4 2"/>
             
             {/* Ears */}
             <circle cx="-40" cy="-35" r="20" className="stroke-gray-800 stroke-2 fill-none" />
             <circle cx="40" cy="-35" r="20" className="stroke-gray-800 stroke-2 fill-none" />
             
             {/* Nose */}
             <ellipse cx="0" cy="5" rx="15" ry="20" className="fill-gray-800" />
             
             {/* Body Blob */}
             <ellipse cx="-20" cy="70" rx="50" ry="60" className="stroke-gray-400 stroke-2 fill-none" strokeDasharray="5 5" />
             
             {/* Arm Wrapping */}
             <path d="M-30,50 C-60,50 -80,60 -90,40" className="stroke-gray-800 stroke-3 fill-none" markerEnd="url(#arrow)" />
             <text x="-120" y="30" className="text-xs fill-gray-600 font-bold">WRAP AROUND</text>
          </g>
      </g>
    </svg>
);

export const RoseDiagram = () => (
    <svg viewBox="0 0 500 300" className="w-full h-full bg-white rounded-lg">
       <g transform="translate(250, 150) scale(1.2)">
           {/* Center Spiral */}
           <path d="M0,0 C5,-5 10,-5 10,0 C10,10 -5,10 -10,0 C-15,-15 15,-15 20,0" className="stroke-indigo-600 stroke-2 fill-none" />
           
           {/* Bowl Shape */}
           <path d="M-25,5 C-25,35 25,35 35,5" className="stroke-gray-400 stroke-1 dashed fill-none" strokeDasharray="4 4" />
           <text x="-40" y="45" className="text-[10px] fill-gray-400">THE BOWL</text>

           {/* Petals */}
           <path d="M-15,-15 C-30,-25 -40,0 -25,20" className="stroke-gray-800 stroke-2 fill-none" />
           <path d="M25,-10 C40,-20 50,10 30,25" className="stroke-gray-800 stroke-2 fill-none" />
           <path d="M-20,25 C0,45 20,40 30,25" className="stroke-gray-800 stroke-2 fill-none" />

           {/* Folded edge example */}
           <path d="M10,-25 C20,-35 30,-25 25,-10" className="stroke-indigo-400 stroke-1 fill-none" />
           <text x="35" y="-25" className="text-[10px] fill-indigo-500">CURLED EDGE</text>
       </g>
    </svg>
);

export const renderDiagram = (type: string) => {
    switch(type) {
        case 'sphere-step-1': return <SphereStep1 />;
        case 'sphere-step-2': return <SphereStep2 />;
        case 'sphere-step-3': return <SphereStep3 />;
        case 'sphere-step-4': return <SphereStep4 />;
        case 'sphere-step-5': return <SphereStep5 />;
        case 'overlap': return <OverlapDiagram />;
        case 'shading': return <ShadingDiagram />;
        case 'cube': return <CubeDiagram />;
        case 'hollow': return <HollowCubeDiagram />;
        case 'table': return <TableDiagram />;
        case 'structure': return <StructureDiagram />;
        case 'density': return <DensityDiagram />;
        case 'koala': return <KoalaDiagram />;
        case 'rose': return <RoseDiagram />;
        default: return null;
    }
}