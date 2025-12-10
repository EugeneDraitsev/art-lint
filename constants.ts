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
    thumbnailImage: 'https://raw.githubusercontent.com/EugeneDraitsev/art-lint/refs/heads/content/content/beginner-shapes/the-sphere/the-sphere-5.jpg'
  },
  {
    id: 'lesson-2-overlapping',
    title: '2. Overlapping Spheres',
    description: 'Create instant depth by placing objects behind one another.',
    difficulty: 'Beginner',
    topics: ['Depth', 'Placement', 'Size'],
    content: lessonContent.overlapping,
    thumbnailImage: 'https://raw.githubusercontent.com/EugeneDraitsev/art-lint/refs/heads/content/content/beginner-shapes/overlapping-spheres/5.jpg'
  },
  {
    id: 'lesson-3-adv-spheres',
    title: '3. Advanced Spheres',
    description: 'Master texture, density, and complex arrangements of spheres.',
    difficulty: 'Intermediate',
    topics: ['Texture', 'Density', 'Composition'],
    content: lessonContent.advancedSpheres,
    thumbnailImage: 'https://raw.githubusercontent.com/EugeneDraitsev/art-lint/refs/heads/content/content/beginner-shapes/advanced-level-spheres/5.jpg'
  },
  {
    id: 'lesson-4-cube',
    title: '4. The Cube',
    description: 'Unlock 3D construction with the "Y-Method" for perfect cubes.',
    difficulty: 'Beginner',
    topics: ['Perspective', 'Structure', 'Geometry'],
    content: lessonContent.cube,
    thumbnailImage: 'https://raw.githubusercontent.com/EugeneDraitsev/art-lint/refs/heads/content/content/beginner-shapes/the-cube/5.jpg'
  },
  {
    id: 'lesson-5-cylinder',
    title: '5. The Cylinder',
    description: 'Combine curves and lines to create cans, towers, and cups.',
    difficulty: 'Beginner',
    topics: ['Form', 'Curves', 'Structure'],
    content: lessonContent.cylinder,
    thumbnailImage: 'https://raw.githubusercontent.com/EugeneDraitsev/art-lint/refs/heads/content/content/beginner-shapes/the-cylinder/5.jpg'
  }
];