
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
  },
  {
    id: '4',
    name: 'Yuki',
    image: '/lovable-uploads/fb81f7c4-2479-410b-b5f5-507182401c0c.png',
    price: 139.99,
    rating: 4.7,
    totalSales: 398,
    creator: 'KawaiiStudio',
    mbti: 'ESFJ',
    personality: ['Bubbly', 'Social', 'Caring', 'Optimistic'],
    favorites: ['Cute cafes', 'Fashion', 'K-pop', 'Anime'],
    growUpStory: 'Yuki grew up in a vibrant city, always surrounded by friends and family. Her infectious energy and genuine care for others made her the heart of every social gathering.',
    voiceDescription: 'Sweet, energetic voice with playful intonation',
    languages: ['Japanese', 'English', 'Korean'],
    lifestyle: ['Kawaii', 'Fashion', 'Social media', 'Pop culture'],
    galleryImages: ['/lovable-uploads/fb81f7c4-2479-410b-b5f5-507182401c0c.png'],
    category: 'Entertainment',
    description: 'A charming avatar perfect for lifestyle content and social media engagement'
  },
  {
    id: '5',
    name: 'Luna',
    image: '/lovable-uploads/269d4ca1-a66f-47a0-98ec-ab49afb20a1e.png',
    price: 159.99,
    rating: 4.9,
    totalSales: 523,
    creator: 'EleganceStudio',
    mbti: 'INFJ',
    personality: ['Elegant', 'Mysterious', 'Intuitive', 'Sophisticated'],
    favorites: ['Classical music', 'Art galleries', 'Fine dining', 'Poetry'],
    growUpStory: 'Luna was raised in an artistic family where beauty and creativity were cherished. She developed a refined taste and an eye for elegance that guides her in everything she does.',
    voiceDescription: 'Smooth, sophisticated voice with subtle warmth',
    languages: ['English', 'French', 'Italian'],
    lifestyle: ['Luxury', 'Art', 'Fashion', 'Culture'],
    galleryImages: ['/lovable-uploads/269d4ca1-a66f-47a0-98ec-ab49afb20a1e.png'],
    category: 'Luxury',
    description: 'An elegant avatar perfect for high-end brand content and sophisticated communications'
  }
];
