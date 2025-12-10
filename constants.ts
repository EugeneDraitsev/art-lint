import { Lesson } from './types';
import { lessonContent } from './content/lessons';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1-sphere',
    title: '1. The Sphere',
    description: 'The foundation of 3D drawing. Learn light sources, core shadows, and cast shadows.',
    difficulty: 'Beginner',
    topics: ['Form', 'Light', 'Shading'],
    content: lessonContent.sphere,
    thumbnailImage: 'https://raw.githubusercontent.com/EugeneDraitsev/art-lint/refs/heads/main/content/beginner-shapes/the-sphere/the-sphere-5.jpg'
  },
  {
    id: 'lesson-2-overlapping',
    title: '2. Overlapping Spheres',
    description: 'Create instant depth by placing objects behind one another.',
    difficulty: 'Beginner',
    topics: ['Depth', 'Placement', 'Size'],
    content: lessonContent.overlapping
  },
  {
    id: 'lesson-3-adv-spheres',
    title: '3. Advanced-Level Spheres',
    description: 'Master texture, density, and complex arrangements of spheres.',
    difficulty: 'Intermediate',
    topics: ['Texture', 'Density', 'Composition'],
    content: lessonContent.advancedSpheres
  },
  {
    id: 'lesson-4-cube',
    title: '4. The Cube',
    description: 'Unlock 3D construction with the "Y-Method" for perfect cubes.',
    difficulty: 'Beginner',
    topics: ['Perspective', 'Structure', 'Geometry'],
    content: lessonContent.cube
  },
  {
    id: 'lesson-5-hollow-cubes',
    title: '5. Hollow Cubes',
    description: 'Give your boxes volume and thickness. Learn to see inside the form.',
    difficulty: 'Intermediate',
    topics: ['Volume', 'Thickness', 'Detail'],
    content: lessonContent.hollowCubes
  },
  {
    id: 'lesson-6-tables',
    title: '6. Stacking Tables',
    description: 'Construction skills. Learn to stack objects vertically with alignment.',
    difficulty: 'Intermediate',
    topics: ['Construction', 'Alignment', 'Furniture'],
    content: lessonContent.tables
  },
  {
    id: 'lesson-7-adv-cubes',
    title: '7. Advanced-Level Cubes',
    description: 'Modifying the cube. Pyramids, ramps, and house-like structures.',
    difficulty: 'Advanced',
    topics: ['Modification', 'Architecture', 'Slopes'],
    content: lessonContent.advancedCubes
  },
  {
    id: 'lesson-8-koalas',
    title: '8. Cool Koalas',
    description: 'Applying geometric forms to organic characters. Drawing soft textures.',
    difficulty: 'Advanced',
    topics: ['Character', 'Texture', 'Organic Forms'],
    content: lessonContent.koalas
  },
  {
    id: 'lesson-9-rose',
    title: '9. The Rose',
    description: 'Organic flow. Drawing spirals, petals, and natural curves.',
    difficulty: 'Advanced',
    topics: ['Nature', 'Flow', 'Curves'],
    content: lessonContent.rose
  }
];