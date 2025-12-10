import React from 'react';

const GradientDef = () => (
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#374151" />
      <stop offset="100%" stopColor="#111827" />
    </linearGradient>
    <radialGradient id="sphere-grad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#e0e7ff" />
        <stop offset="100%" stopColor="#4338ca" />
    </radialGradient>
  </defs>
);

const BaseSvg = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 400 250" className="w-full h-full object-cover">
    <GradientDef />
    <rect width="400" height="250" fill="url(#bg-gradient)" />
    {children}
  </svg>
);

export const SphereThumbnail = () => (
  <BaseSvg>
    <circle cx="200" cy="125" r="60" fill="url(#sphere-grad)" />
    <ellipse cx="200" cy="200" rx="60" ry="10" fill="black" opacity="0.3" />
  </BaseSvg>
);

export const OverlappingThumbnail = () => (
  <BaseSvg>
    <circle cx="230" cy="110" r="40" fill="#4b5563" />
    <circle cx="170" cy="140" r="50" fill="url(#sphere-grad)" />
  </BaseSvg>
);

export const AdvSpheresThumbnail = () => (
  <BaseSvg>
    <g opacity="0.5">
       <circle cx="100" cy="80" r="20" fill="#6b7280" />
       <circle cx="300" cy="60" r="15" fill="#6b7280" />
       <circle cx="200" cy="50" r="10" fill="#6b7280" />
    </g>
    <circle cx="150" cy="150" r="40" fill="url(#sphere-grad)" />
    <circle cx="250" cy="130" r="50" fill="#6366f1" opacity="0.8" />
  </BaseSvg>
);

export const CubeThumbnail = () => (
  <BaseSvg>
    <path d="M200,80 L250,110 L200,140 L150,110 Z" fill="#818cf8" />
    <path d="M150,110 L200,140 L200,200 L150,170 Z" fill="#4f46e5" />
    <path d="M200,140 L250,110 L250,170 L200,200 Z" fill="#312e81" />
  </BaseSvg>
);

export const HollowThumbnail = () => (
  <BaseSvg>
    <path d="M180,90 L280,90 L280,190 L180,190 Z" fill="none" stroke="#6366f1" strokeWidth="4" />
    <path d="M280,90 L320,60 L320,160 L280,190" fill="#312e81" opacity="0.5" />
    <path d="M180,90 L220,60 L320,60" fill="#4f46e5" opacity="0.5" />
    <path d="M220,60 L220,160 L180,190" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" />
  </BaseSvg>
);

export const TableThumbnail = () => (
  <BaseSvg>
    <path d="M100,150 L300,150 L340,110 L140,110 Z" fill="#4f46e5" />
    <rect x="110" y="150" width="10" height="60" fill="#312e81" />
    <rect x="290" y="150" width="10" height="60" fill="#312e81" />
    <rect x="320" y="110" width="10" height="40" fill="#312e81" opacity="0.5" />
  </BaseSvg>
);

export const AdvCubeThumbnail = () => (
  <BaseSvg>
     <path d="M200,60 L140,140 L260,140 Z" fill="#818cf8" />
     <rect x="160" y="140" width="80" height="60" fill="#4f46e5" />
     <rect x="190" y="170" width="20" height="30" fill="#1f2937" />
  </BaseSvg>
);

export const KoalaThumbnail = () => (
  <BaseSvg>
    <circle cx="200" cy="120" r="50" fill="#9ca3af" />
    <circle cx="160" cy="90" r="20" fill="#6b7280" />
    <circle cx="240" cy="90" r="20" fill="#6b7280" />
    <ellipse cx="200" cy="120" rx="15" ry="20" fill="#1f2937" />
    <rect x="180" y="160" width="40" height="60" rx="20" fill="#9ca3af" />
  </BaseSvg>
);

export const RoseThumbnail = () => (
  <BaseSvg>
    <path d="M200,125 C180,100 220,100 200,125 C150,80 250,80 200,125 C120,50 280,50 200,125" stroke="#f43f5e" strokeWidth="4" fill="none" />
    <path d="M200,125 Q160,180 200,220" stroke="#10b981" strokeWidth="4" fill="none" />
    <path d="M200,170 Q230,160 240,140" stroke="#10b981" strokeWidth="4" fill="none" />
  </BaseSvg>
);

export const getLessonThumbnail = (id: string) => {
  switch (id) {
    case 'lesson-1-sphere': return <SphereThumbnail />;
    case 'lesson-2-overlapping': return <OverlappingThumbnail />;
    case 'lesson-3-adv-spheres': return <AdvSpheresThumbnail />;
    case 'lesson-4-cube': return <CubeThumbnail />;
    case 'lesson-5-hollow-cubes': return <HollowThumbnail />;
    case 'lesson-6-tables': return <TableThumbnail />;
    case 'lesson-7-adv-cubes': return <AdvCubeThumbnail />;
    case 'lesson-8-koalas': return <KoalaThumbnail />;
    case 'lesson-9-rose': return <RoseThumbnail />;
    default: return <SphereThumbnail />;
  }
};