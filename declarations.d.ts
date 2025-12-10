import 'react';

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

// Augment React's JSX namespace for React 18+ and newer TypeScript versions
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      color: any;
      ambientLight: any;
      directionalLight: any;
      mesh: any;
      sphereGeometry: any;
      boxGeometry: any;
      cylinderGeometry: any;
      planeGeometry: any;
      meshStandardMaterial: any;
      group: any;
      primitive: any;
      spotLight: any;
      pointLight: any;
      gridHelper: any;
    }
  }
}

// Augment the global JSX namespace for older configurations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      color: any;
      ambientLight: any;
      directionalLight: any;
      mesh: any;
      sphereGeometry: any;
      boxGeometry: any;
      cylinderGeometry: any;
      planeGeometry: any;
      meshStandardMaterial: any;
      group: any;
      primitive: any;
      spotLight: any;
      pointLight: any;
      gridHelper: any;
    }
  }
}