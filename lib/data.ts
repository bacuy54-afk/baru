import { Product, AdminUser } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Website Template Pack',
    description: 'Collection of 10 modern, responsive website templates perfect for businesses, portfolios, and landing pages.',
    price: 49,
    originalPrice: 99,
    category: 'Templates',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    features: [
      '10 Premium Templates',
      'Fully Responsive Design',
      'HTML, CSS, JS Source Code',
      'Documentation Included',
      'Lifetime Updates'
    ],
    downloadLink: '#',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'UI/UX Design System',
    description: 'Complete design system with components, icons, and guidelines for modern web applications.',
    price: 79,
    originalPrice: 129,
    category: 'Design',
    image: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg',
    features: [
      '200+ UI Components',
      'Icon Library (500+ Icons)',
      'Color Palette & Typography',
      'Figma & Sketch Files',
      'Style Guide Documentation'
    ],
    downloadLink: '#',
    tags: ['UI', 'UX', 'Figma', 'Sketch'],
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'React Component Library',
    description: 'Professional React component library with TypeScript support and comprehensive documentation.',
    price: 89,
    originalPrice: 149,
    category: 'Code',
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
    features: [
      '50+ React Components',
      'TypeScript Support',
      'Storybook Documentation',
      'Unit Tests Included',
      'NPM Package Ready'
    ],
    downloadLink: '#',
    tags: ['React', 'TypeScript', 'Components'],
    createdAt: '2024-01-05'
  },
  {
    id: '4',
    name: 'Mobile App UI Kit',
    description: 'Complete mobile app UI kit with screens, components, and assets for iOS and Android development.',
    price: 69,
    category: 'Mobile',
    image: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
    features: [
      '100+ Mobile Screens',
      'iOS & Android Compatible',
      'Sketch & Figma Files',
      'Icon Set Included',
      'Dark & Light Themes'
    ],
    downloadLink: '#',
    tags: ['Mobile', 'iOS', 'Android', 'UI'],
    createdAt: '2024-01-01'
  }
];

export const adminUsers: AdminUser[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123' // In production, this should be hashed
  }
];