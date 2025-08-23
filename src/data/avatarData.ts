
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
  },
  {
    id: '6',
    name: 'Mira',
    image: '/lovable-uploads/3da4a6b0-da99-437a-8673-fcf40dadcace.png',
    price: 134.99,
    rating: 4.8,
    totalSales: 367,
    creator: 'CozyStudio',
    mbti: 'ISFJ',
    personality: ['Gentle', 'Thoughtful', 'Calm', 'Nurturing'],
    favorites: ['Herbal tea', 'Reading', 'Cozy sweaters', 'Rainy days'],
    growUpStory: 'Mira found peace in quiet moments and simple pleasures. Growing up in a loving household, she learned that the most beautiful moments are often the simplest ones.',
    voiceDescription: 'Soft, soothing voice perfect for relaxation and comfort',
    languages: ['English', 'Mandarin', 'Japanese'],
    lifestyle: ['Minimalist', 'Wellness', 'Self-care', 'Mindfulness'],
    galleryImages: ['/lovable-uploads/3da4a6b0-da99-437a-8673-fcf40dadcace.png'],
    category: 'Wellness',
    description: 'A calming avatar ideal for wellness content and peaceful interactions'
  },
  {
    id: '7',
    name: 'Kai',
    image: '/lovable-uploads/1ed5d919-4459-4a2b-a32a-aeaf07f4779a.png',
    price: 119.99,
    rating: 4.6,
    totalSales: 298,
    creator: 'EdgeStudio',
    mbti: 'ISTP',
    personality: ['Mysterious', 'Independent', 'Cool', 'Artistic'],
    favorites: ['Dark aesthetics', 'Underground music', 'Night photography', 'Coffee'],
    growUpStory: 'Kai always marched to the beat of his own drum. Growing up as an observer rather than a performer, he developed a unique perspective on life that others find intriguing.',
    voiceDescription: 'Deep, mysterious voice with subtle intensity',
    languages: ['English', 'Korean', 'Japanese'],
    lifestyle: ['Alternative', 'Artistic', 'Indie', 'Urban'],
    galleryImages: ['/lovable-uploads/1ed5d919-4459-4a2b-a32a-aeaf07f4779a.png'],
    category: 'Alternative',
    description: 'A mysterious avatar perfect for edgy content and alternative lifestyle brands'
  },
  {
    id: '8',
    name: 'Alexander',
    image: '/lovable-uploads/620dccd2-1550-40be-95ed-1f20ad2f9b32.png',
    price: 179.99,
    rating: 4.9,
    totalSales: 445,
    creator: 'EliteStudio',
    mbti: 'ENTJ',
    personality: ['Charismatic', 'Ambitious', 'Confident', 'Strategic'],
    favorites: ['Fine suits', 'Wine tasting', 'Chess', 'Classical architecture'],
    growUpStory: 'Alexander was born into a world of high expectations and unlimited possibilities. His natural leadership abilities and refined taste have made him a respected figure in elite circles.',
    voiceDescription: 'Commanding, sophisticated voice with natural authority',
    languages: ['English', 'French', 'Italian', 'German'],
    lifestyle: ['Luxury', 'Business', 'High society', 'Exclusive'],
    galleryImages: ['/lovable-uploads/620dccd2-1550-40be-95ed-1f20ad2f9b32.png'],
    category: 'Luxury',
    description: 'A distinguished avatar perfect for luxury brands and executive communications'
  },
  {
    id: '9',
    name: 'Ethan',
    image: '/lovable-uploads/7b694883-4403-4c7c-9361-01ac8871d1bc.png',
    price: 99.99,
    rating: 4.7,
    totalSales: 334,
    creator: 'CasualStudio',
    mbti: 'ESFP',
    personality: ['Relaxed', 'Friendly', 'Approachable', 'Genuine'],
    favorites: ['Comfort food', 'Casual hangouts', 'Sports', 'Comedy shows'],
    growUpStory: 'Ethan believes life is meant to be enjoyed. Growing up in a close-knit community, he learned that the best connections are made through genuine, down-to-earth interactions.',
    voiceDescription: 'Warm, friendly voice with natural charm',
    languages: ['English', 'Korean'],
    lifestyle: ['Casual', 'Everyday', 'Relatable', 'Authentic'],
    galleryImages: ['/lovable-uploads/7b694883-4403-4c7c-9361-01ac8871d1bc.png'],
    category: 'Casual',
    description: 'A relatable avatar perfect for everyday content and authentic brand communications'
  },
  {
    id: '10',
    name: 'Sakura',
    image: '/lovable-uploads/7a5cf907-e9a9-4f4f-b32f-a0e2f2697662.png',
    price: 144.99,
    rating: 4.8,
    totalSales: 412,
    creator: 'SpringStudio',
    mbti: 'ENFJ',
    personality: ['Warm', 'Inspiring', 'Compassionate', 'Graceful'],
    favorites: ['Cherry blossoms', 'Traditional tea ceremony', 'Helping others', 'Sunrise'],
    growUpStory: 'Sakura grew up appreciating the beauty in traditional values while embracing modern possibilities. Her gentle strength and inspiring presence make others feel uplifted and motivated.',
    voiceDescription: 'Gentle, inspiring voice with natural warmth',
    languages: ['Japanese', 'English', 'Mandarin'],
    lifestyle: ['Traditional', 'Inspirational', 'Wellness', 'Cultural'],
    galleryImages: ['/lovable-uploads/7a5cf907-e9a9-4f4f-b32f-a0e2f2697662.png'],
    category: 'Cultural',
    description: 'An inspiring avatar perfect for motivational content and cultural brand representation'
  }
];
