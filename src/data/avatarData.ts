
export interface AvatarProfile {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  totalSales: number;
  creator: string;
  mbti: string;
  personality: string[];
  favorites: string[];
  growUpStory: string;
  voiceDescription: string;
  languages: string[];
  lifestyle: string[];
  galleryImages: string[];
  category: string;
  description: string;
}

export const avatarProfiles: AvatarProfile[] = [
  {
    id: '1',
    name: 'Oliver',
    image: '/lovable-uploads/bbe9701d-0f56-426e-8fff-fc196bea0815.png',
    price: 89.99,
    rating: 4.9,
    totalSales: 342,
    creator: 'KidsStudio',
    mbti: 'ENFP',
    personality: ['Cheerful', 'Curious', 'Energetic', 'Playful'],
    favorites: ['Building blocks', 'Storytelling', 'Adventure games', 'Ice cream'],
    growUpStory: 'Oliver grew up in a cozy suburban neighborhood where imagination was his best friend. He spent countless hours building fantastic worlds with his toys and sharing wild stories with anyone who would listen.',
    voiceDescription: 'Bright, enthusiastic child voice with infectious laughter',
    languages: ['English', 'Spanish'],
    lifestyle: ['Family-friendly', 'Educational', 'Creative play'],
    galleryImages: ['/lovable-uploads/bbe9701d-0f56-426e-8fff-fc196bea0815.png'],
    category: 'Kids',
    description: 'A joyful young avatar perfect for family content and educational interactions'
  },
  {
    id: '2',
    name: 'Emma',
    image: '/lovable-uploads/621420e1-be52-41a0-a02b-9fa64b7a52f7.png',
    price: 129.99,
    rating: 4.8,
    totalSales: 287,
    creator: 'ProStudio',
    mbti: 'INTJ',
    personality: ['Professional', 'Analytical', 'Confident', 'Detail-oriented'],
    favorites: ['Coffee', 'Strategic planning', 'Tech innovations', 'Minimalist design'],
    growUpStory: 'Emma climbed the corporate ladder through dedication and smart decision-making. She believes in efficiency and always looks for innovative solutions to complex problems.',
    voiceDescription: 'Clear, professional tone with authoritative presence',
    languages: ['English', 'German', 'French'],
    lifestyle: ['Business', 'Corporate', 'Leadership'],
    galleryImages: ['/lovable-uploads/621420e1-be52-41a0-a02b-9fa64b7a52f7.png'],
    category: 'Business',
    description: 'A sophisticated professional avatar ideal for corporate presentations and business communications'
  },
  {
    id: '3',
    name: 'Aria',
    image: '/lovable-uploads/ba97f001-ee2b-43d0-b1b7-2ae06d422f96.png',
    price: 149.99,
    rating: 4.9,
    totalSales: 456,
    creator: 'NatureStudio',
    mbti: 'ISFP',
    personality: ['Free-spirited', 'Artistic', 'Nature-loving', 'Adventurous'],
    favorites: ['Hiking', 'Photography', 'Sunset watching', 'Organic food'],
    growUpStory: 'Aria grew up in a small mountain town, always feeling most at home in nature. She discovered her love for photography while exploring hidden trails and capturing the beauty of untouched landscapes.',
    voiceDescription: 'Gentle, melodic voice with a hint of wanderlust',
    languages: ['English', 'Japanese', 'Korean'],
    lifestyle: ['Travel', 'Nature', 'Photography', 'Wellness'],
    galleryImages: ['/lovable-uploads/ba97f001-ee2b-43d0-b1b7-2ae06d422f96.png'],
    category: 'Lifestyle',
    description: 'A free-spirited avatar perfect for travel vlogs and nature content'
  }
];
