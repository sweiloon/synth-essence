
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
    name: 'Marcus',
    image: '/lovable-uploads/1ed5d919-4459-4a2b-a32a-aeaf07f4779a.png',
    price: 199.99,
    rating: 4.7,
    totalSales: 123,
    creator: 'LuxuryStudio',
    mbti: 'ENTJ',
    personality: ['Sophisticated', 'Ambitious', 'Charismatic', 'Strategic'],
    favorites: ['Fine dining', 'Luxury cars', 'Investment', 'Classical music'],
    growUpStory: 'Marcus was born into privilege but earned his success through relentless ambition and strategic thinking. He believes in excellence and never settles for mediocrity.',
    voiceDescription: 'Deep, commanding voice with refined articulation',
    languages: ['English', 'French', 'Italian'],
    lifestyle: ['Luxury', 'Business', 'High-end'],
    galleryImages: ['/lovable-uploads/1ed5d919-4459-4a2b-a32a-aeaf07f4779a.png'],
    category: 'Luxury',
    description: 'An elegant and sophisticated avatar for premium brand content'
  },
  {
    id: '5',
    name: 'Luna',
    image: '/lovable-uploads/3da4a6b0-da99-437a-8673-fcf40dadcace.png',
    price: 119.99,
    rating: 4.8,
    totalSales: 298,
    creator: 'WellnessStudio',
    mbti: 'INFP',
    personality: ['Spiritual', 'Empathetic', 'Calm', 'Intuitive'],
    favorites: ['Meditation', 'Yoga', 'Herbal tea', 'Crystal healing'],
    growUpStory: 'Luna discovered her spiritual path early in life through meditation and mindfulness practices. She dedicated herself to helping others find inner peace and balance.',
    voiceDescription: 'Soft, soothing voice with mindful pacing',
    languages: ['English', 'Sanskrit', 'Chinese'],
    lifestyle: ['Wellness', 'Spiritual', 'Mindfulness'],
    galleryImages: ['/lovable-uploads/3da4a6b0-da99-437a-8673-fcf40dadcace.png'],
    category: 'Wellness',
    description: 'A peaceful avatar perfect for wellness and spiritual content'
  },
  {
    id: '6',
    name: 'Zara',
    image: '/lovable-uploads/269d4ca1-a66f-47a0-98ec-ab49afb20a1e.png',
    price: 159.99,
    rating: 4.6,
    totalSales: 189,
    creator: 'AlternativeStudio',
    mbti: 'ESTP',
    personality: ['Rebellious', 'Creative', 'Bold', 'Independent'],
    favorites: ['Rock music', 'Skateboarding', 'Street art', 'Vintage fashion'],
    growUpStory: 'Zara grew up in the underground music scene, expressing herself through art and rebellion. She believes in breaking conventions and creating her own path.',
    voiceDescription: 'Edgy, confident voice with attitude',
    languages: ['English', 'Spanish', 'Portuguese'],
    lifestyle: ['Alternative', 'Creative', 'Urban'],
    galleryImages: ['/lovable-uploads/269d4ca1-a66f-47a0-98ec-ab49afb20a1e.png'],
    category: 'Alternative',
    description: 'A bold and edgy avatar for alternative and creative content'
  },
  {
    id: '7',
    name: 'Sofia',
    image: '/lovable-uploads/620dccd2-1550-40be-95ed-1f20ad2f9b32.png',
    price: 109.99,
    rating: 4.9,
    totalSales: 367,
    creator: 'CasualStudio',
    mbti: 'ISFJ',
    personality: ['Friendly', 'Reliable', 'Caring', 'Down-to-earth'],
    favorites: ['Cooking', 'Family time', 'Gardening', 'Reading'],
    growUpStory: 'Sofia values simple pleasures and genuine connections. She grew up in a loving family and believes in the importance of community and caring for others.',
    voiceDescription: 'Warm, friendly voice with natural charm',
    languages: ['English', 'Spanish', 'Italian'],
    lifestyle: ['Casual', 'Family', 'Community'],
    galleryImages: ['/lovable-uploads/620dccd2-1550-40be-95ed-1f20ad2f9b32.png'],
    category: 'Casual',
    description: 'A warm and approachable avatar perfect for everyday content'
  },
  {
    id: '8',
    name: 'Kai',
    image: '/lovable-uploads/7a5cf907-e9a9-4f4f-b32f-a0e2f2697662.png',
    price: 139.99,
    rating: 4.7,
    totalSales: 234,
    creator: 'CulturalStudio',
    mbti: 'ENFJ',
    personality: ['Wise', 'Traditional', 'Respectful', 'Patient'],
    favorites: ['Tea ceremony', 'Calligraphy', 'Philosophy', 'Traditional music'],
    growUpStory: 'Kai was raised with deep respect for tradition and cultural values. He dedicates his life to preserving ancient wisdom while bridging it with modern understanding.',
    voiceDescription: 'Measured, thoughtful voice with cultural depth',
    languages: ['Japanese', 'English', 'Chinese'],
    lifestyle: ['Traditional', 'Cultural', 'Philosophical'],
    galleryImages: ['/lovable-uploads/7a5cf907-e9a9-4f4f-b32f-a0e2f2697662.png'],
    category: 'Cultural',
    description: 'A culturally rich avatar for traditional and educational content'
  },
  {
    id: '9',
    name: 'Max',
    image: '/lovable-uploads/7b694883-4403-4c7c-9361-01ac8871d1bc.png',
    price: 99.99,
    rating: 4.8,
    totalSales: 445,
    creator: 'EntertainmentStudio',
    mbti: 'ESFP',
    personality: ['Entertaining', 'Humorous', 'Spontaneous', 'Charismatic'],
    favorites: ['Stand-up comedy', 'Gaming', 'Movies', 'Party planning'],
    growUpStory: 'Max discovered his talent for entertainment early and has been making people laugh ever since. He believes life should be fun and full of memorable moments.',
    voiceDescription: 'Animated, expressive voice with comedic timing',
    languages: ['English', 'Spanish', 'French'],
    lifestyle: ['Entertainment', 'Gaming', 'Social'],
    galleryImages: ['/lovable-uploads/7b694883-4403-4c7c-9361-01ac8871d1bc.png'],
    category: 'Entertainment',
    description: 'A fun and energetic avatar perfect for entertainment content'
  },
  {
    id: '10',
    name: 'Isabella',
    image: '/lovable-uploads/fb81f7c4-2479-410b-b5f5-507182401c0c.png',
    price: 179.99,
    rating: 4.9,
    totalSales: 156,
    creator: 'FashionStudio',
    mbti: 'ESFJ',
    personality: ['Stylish', 'Trendy', 'Social', 'Confident'],
    favorites: ['Fashion shows', 'Shopping', 'Social media', 'Beauty treatments'],
    growUpStory: 'Isabella has always had an eye for style and trends. She turned her passion for fashion into a lifestyle, inspiring others to express themselves through their personal style.',
    voiceDescription: 'Stylish, confident voice with fashion flair',
    languages: ['English', 'French', 'Italian'],
    lifestyle: ['Fashion', 'Beauty', 'Social media'],
    galleryImages: ['/lovable-uploads/fb81f7c4-2479-410b-b5f5-507182401c0c.png'],
    category: 'Lifestyle',
    description: 'A fashionable avatar perfect for style and beauty content'
  },
  {
    id: '11',
    name: 'Alex',
    image: '/lovable-uploads/1fab5331-8802-41ed-b1c5-5d8aab9b3268.png',
    price: 124.99,
    rating: 4.6,
    totalSales: 278,
    creator: 'TechStudio',
    mbti: 'INTP',
    personality: ['Innovative', 'Logical', 'Curious', 'Tech-savvy'],
    favorites: ['Coding', 'AI research', 'Gadgets', 'Science fiction'],
    growUpStory: 'Alex grew up fascinated by technology and its potential to change the world. They spend their time exploring new innovations and pushing the boundaries of what\'s possible.',
    voiceDescription: 'Clear, analytical voice with tech enthusiasm',
    languages: ['English', 'Python', 'JavaScript'],
    lifestyle: ['Technology', 'Innovation', 'Research'],
    galleryImages: ['/lovable-uploads/1fab5331-8802-41ed-b1c5-5d8aab9b3268.png'],
    category: 'Business',
    description: 'A tech-focused avatar perfect for innovation and technology content'
  }
];
