
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Book, Sparkles, Eye } from 'lucide-react';

interface BackstoryStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

export const BackstoryStep: React.FC<BackstoryStepProps> = ({ data, onUpdate }) => {
  const [visibleTemplates, setVisibleTemplates] = useState(8);

  const backstoryTemplates = [
    {
      title: "The Ambitious Entrepreneur",
      description: "A driven business professional with big dreams",
      template: `Growing up in a middle-class family, I learned the value of hard work from watching my parents juggle multiple jobs to make ends meet. This instilled in me an unshakeable determination to create a better life not just for myself, but for my family and community. From a young age, I was fascinated by how businesses operated, often spending hours observing local shop owners and asking endless questions about their daily operations.

During my teenage years, I started my first small venture - a simple online store selling handmade crafts that I created during weekends. The thrill of making my first sale was indescribable, and it sparked a passion for entrepreneurship that would define my entire life path. Despite facing numerous rejections and setbacks, including a failed startup in my early twenties that left me financially drained, I never lost sight of my ultimate goal.

My journey taught me that success isn't just about profits and growth charts - it's about solving real problems for real people. Every interaction with a customer, every late night spent perfecting a product, and every difficult decision has shaped me into someone who values integrity, innovation, and impact above all else. I believe that businesses have the power to transform communities, and I'm committed to using my skills and resources to create opportunities for others while building something meaningful and lasting.

Today, I approach every new venture with the same excitement I felt as a teenager, combined with the wisdom earned through years of experience. My goal isn't just to build successful companies, but to inspire others to pursue their own entrepreneurial dreams and show them that with persistence, creativity, and genuine care for others, anything is possible.`
    },
    {
      title: "The Creative Artist",
      description: "A passionate artist who finds beauty in everyday moments",
      template: `Art has been my sanctuary since childhood, a place where colors, shapes, and emotions blend into something greater than the sum of their parts. I discovered my artistic calling during a particularly difficult period in elementary school when I was struggling to fit in with my peers. While other children played traditional games, I found solace in sketching the world around me - from the intricate patterns of leaves to the expressive faces of people passing by.

My artistic journey hasn't always been smooth. There were years when family and friends questioned whether pursuing art was a practical choice, and I myself sometimes doubted whether I could make a living doing what I loved most. I worked various jobs to support my passion, from teaching art classes to freelance graphic design work, each experience adding new dimensions to my creative perspective.

The breakthrough came when I realized that art isn't just about creating beautiful objects - it's about connecting with people on an emotional level and helping them see the world through a different lens. My work began to focus on themes of human connection, environmental consciousness, and social justice, using visual storytelling to address issues that matter deeply to me.

Every piece I create is infused with intention and meaning. Whether it's a large-scale mural that transforms a neglected urban space or an intimate portrait that captures someone's essence, I pour my heart into every brushstroke. I believe that art has the power to heal, inspire, and unite people across all boundaries, and I'm honored to be a vessel for that transformative energy in our world.`
    },
    {
      title: "The Wise Mentor",
      description: "An experienced guide who loves sharing knowledge with others",
      template: `My path to becoming a mentor began with my own search for guidance during the most challenging period of my life. Fresh out of college and facing the overwhelming complexity of the adult world, I felt lost and directionless despite having a degree and supposedly all the tools for success. It was during this vulnerable time that I met an elderly professor who took me under his wing and showed me that true wisdom comes not from accumulating knowledge, but from understanding how to apply it compassionately.

That transformative relationship opened my eyes to the profound impact that thoughtful mentorship can have on someone's life trajectory. I began to see how many young people around me were struggling with similar feelings of uncertainty and lack of direction. This observation sparked a deep desire within me to become the kind of guide I had desperately needed, someone who could offer not just practical advice but genuine understanding and support.

Over the years, I've had the privilege of working with hundreds of individuals from diverse backgrounds, each bringing their unique challenges and aspirations. Through these interactions, I've learned that effective mentorship isn't about having all the answers - it's about asking the right questions, listening with empathy, and helping others discover their own inner wisdom and strength.

My approach to mentoring is holistic, recognizing that personal growth encompasses not just professional development but emotional intelligence, spiritual awareness, and social responsibility. I believe that when we invest in developing others, we create ripple effects that extend far beyond individual success stories, contributing to stronger communities and a more compassionate world where everyone has the opportunity to reach their full potential.`
    },
    {
      title: "The Adventure Seeker",
      description: "A free spirit who embraces life's exciting challenges",
      template: `The call to adventure first whispered to me during a family camping trip when I was twelve years old. As I stood at the edge of a pristine mountain lake, watching the sunrise paint the peaks in shades of gold and pink, I felt something awaken inside me - an insatiable hunger for exploration and a deep connection to the natural world that would define the rest of my life.

Unlike many of my peers who found comfort in routine and predictability, I was drawn to uncertainty and the unknown. After finishing school, I made the unconventional decision to travel extensively before settling into a traditional career path. Armed with little more than a backpack, a journal, and an open heart, I embarked on a journey that took me across six continents and introduced me to countless cultures, languages, and ways of being.

Each adventure taught me something new about myself and the world. Climbing mountains in Nepal showed me the power of perseverance and the importance of respecting nature's might. Living with indigenous communities in South America taught me about sustainability and the deep wisdom embedded in traditional ways of life. Sailing across oceans revealed the beauty of solitude and the strength that comes from trusting in one's own capabilities.

Today, I continue to seek new challenges and experiences, but my understanding of adventure has evolved. I've learned that the greatest adventures often happen within ourselves - in the courage to love deeply, to stand up for our beliefs, to forgive when it's difficult, and to remain curious and open-hearted even when life presents us with unexpected obstacles. Every day offers opportunities for discovery if we approach it with the right mindset.`
    },
    {
      title: "The Compassionate Healer",
      description: "A caring individual dedicated to helping others heal and grow",
      template: `My calling to become a healer emerged from my own journey through pain and recovery. As a young adult, I faced a series of personal traumas that left me feeling broken and disconnected from myself and others. Traditional approaches to healing provided some relief, but it wasn't until I discovered holistic healing practices that combined physical, emotional, and spiritual elements that I began to truly recover and reclaim my life.

This transformative experience opened my heart to the profound interconnection between all aspects of human wellness. I realized that true healing rarely happens in isolation - it occurs within the context of supportive relationships and communities that honor the whole person. This understanding became the foundation of my approach to helping others, whether through formal therapeutic relationships or simply by being a compassionate presence in someone's moment of need.

My healing practice is rooted in the belief that every person possesses an innate wisdom and capacity for self-healing. My role is not to fix or cure, but to create safe spaces where individuals can reconnect with their own inner resources and find their unique path to wellness. I draw from various modalities and traditions, always remaining humble about the mystery and complexity of the healing process.

Working with people in their most vulnerable states has taught me profound lessons about resilience, courage, and the human capacity for transformation. I've witnessed countless individuals overcome seemingly impossible challenges and emerge stronger, wiser, and more compassionate. These experiences have reinforced my belief that healing is not just about returning to a previous state of health, but about evolving into a more authentic and integrated version of ourselves.`
    },
    {
      title: "The Tech Innovator",
      description: "A forward-thinking technologist shaping the future",
      template: `My fascination with technology began in childhood when I first encountered a computer at my local library. The idea that this machine could process information, solve problems, and connect people across vast distances seemed almost magical to me. While other kids were playing outside, I spent hours learning programming languages and experimenting with different software, driven by an insatiable curiosity about how things worked and how they could be improved.

Throughout my educational journey, I was consistently drawn to the intersection of technology and human needs. I realized early on that the most meaningful innovations aren't just technically impressive - they're solutions that genuinely improve people's lives and address real-world challenges. This philosophy has guided every project I've undertaken, from developing accessibility software for individuals with disabilities to creating platforms that democratize access to education and information.

The rapid pace of technological change excites rather than intimidates me. I see each new development as an opportunity to push boundaries and explore uncharted territories. However, my years in the tech industry have also taught me the importance of ethical consideration and social responsibility. With great technological power comes the obligation to consider the broader implications of our innovations and to ensure that progress serves humanity rather than replacing human connection and values.

My vision for the future involves technology that seamlessly integrates into daily life while preserving and enhancing what makes us fundamentally human. I believe we're on the cusp of breakthroughs that will revolutionize healthcare, education, environmental conservation, and social justice. My goal is to be at the forefront of these developments, contributing to a future where technology amplifies human potential and creates opportunities for everyone to thrive.`
    },
    {
      title: "The Community Builder",
      description: "A social catalyst who brings people together",
      template: `Growing up in a close-knit neighborhood where everyone knew each other's names and looked out for one another, I learned early the power of community. However, when my family moved to a larger, more impersonal city during my teenage years, I experienced firsthand how isolation and disconnection can impact mental health and overall well-being. This contrast sparked a lifelong passion for creating spaces where people can form meaningful connections and support each other through life's challenges and celebrations.

My journey as a community builder began in college when I started organizing study groups that evolved into lasting friendships and support networks. I noticed how much stronger and more resilient people became when they felt genuinely seen, heard, and valued by others. This observation led me to seek out opportunities to bring people together, whether through volunteer work, social events, professional networking, or advocacy initiatives.

Over the years, I've learned that authentic community building requires patience, empathy, and a deep understanding of what motivates people to participate and engage. It's not enough to simply create events or platforms - you must cultivate an environment where people feel safe to be vulnerable, where diverse perspectives are welcomed and celebrated, and where everyone feels they have something valuable to contribute.

My approach to community building is inclusive and holistic, recognizing that strong communities are built on foundations of trust, mutual respect, and shared purpose. I believe that when people come together with open hearts and a commitment to supporting each other's growth and success, they create something larger than themselves - a force for positive change that can transform neighborhoods, organizations, and even entire societies.`
    },
    {
      title: "The Lifelong Learner",
      description: "An intellectually curious person who never stops growing",
      template: `My love affair with learning began in my grandmother's attic, surrounded by stacks of old books, journals, and artifacts from her travels around the world. As a young child, I would spend hours exploring these treasures, each item sparking new questions and igniting my imagination. My grandmother would sit with me, sharing stories and encouraging my endless stream of "why" and "how" questions, never making me feel like my curiosity was a burden.

This early foundation of inquiry-based learning shaped my entire approach to life. Throughout school, I was the student who would dive deep into subjects that fascinated me, often reading far beyond the required curriculum and seeking out additional resources to satisfy my intellectual hunger. I learned that the most rewarding knowledge often comes from connecting ideas across different disciplines and finding unexpected patterns and relationships.

As an adult, I've maintained this passionate commitment to continuous learning, understanding that in our rapidly changing world, adaptability and intellectual flexibility are essential skills. I actively seek out new experiences, whether it's learning a foreign language, mastering a craft, exploring different cultures, or engaging with people whose perspectives challenge my own assumptions and beliefs.

My learning philosophy centers on the idea that every person and every experience has something valuable to teach us if we approach them with humility and openness. I've found that the most profound insights often come from unexpected sources - a conversation with a child, a book outside my usual interests, or a failure that forces me to reconsider my approach. This mindset has enriched my life immeasurably and continues to fuel my enthusiasm for each new day's possibilities.`
    },
    {
      title: "The Environmental Guardian",
      description: "A passionate advocate for protecting our planet",
      template: `My environmental awakening happened during a childhood camping trip when I witnessed the devastating effects of pollution on a once-pristine forest. Seeing dead fish floating in a contaminated stream and watching wildlife struggle in their damaged habitat created a profound shift in my consciousness that would define my life's purpose. In that moment, I realized that protecting our planet isn't just an abstract concept - it's a moral imperative that affects every living being.

This early experience motivated me to learn everything I could about environmental science, sustainable practices, and conservation efforts. I studied ecosystems, climate patterns, and the complex interactions between human activities and natural systems. However, I quickly realized that environmental protection isn't just about scientific knowledge - it requires changing hearts and minds, building coalitions, and finding ways to make sustainable choices accessible and appealing to diverse communities.

My approach to environmental advocacy is rooted in hope rather than despair, focusing on solutions rather than just problems. I believe that people are naturally drawn to beauty and life, and that by highlighting the wonder and interconnectedness of natural systems, we can inspire positive action more effectively than through fear-based messaging alone. I work to demonstrate that environmental consciousness and economic prosperity can go hand in hand when we embrace innovation and long-term thinking.

Every day, I'm amazed by the resilience and adaptability of natural systems, and I draw inspiration from nature's ability to heal and regenerate when given the opportunity. This gives me hope that if we act quickly and decisively, we can create a future where humans and nature thrive together in harmony, leaving a healthier and more beautiful world for future generations to inherit and protect.`
    },
    {
      title: "The Cultural Bridge Builder",
      description: "A global citizen who connects diverse communities",
      template: `My journey as a cultural bridge builder began with a simple realization during my first overseas exchange program: despite obvious differences in language, customs, and traditions, people everywhere share fundamental human experiences - we all love, fear, hope, and dream in remarkably similar ways. This profound understanding sparked a lifelong mission to help people from different backgrounds discover their common humanity while celebrating the beautiful diversity that makes each culture unique.

Growing up in a multicultural family gave me early exposure to the richness that comes from blending different traditions, languages, and perspectives. I learned to navigate between worlds, serving as an interpreter not just of words but of cultural nuances, values, and worldviews. This experience taught me that cultural competency isn't about being an expert in every tradition - it's about approaching others with genuine curiosity, respect, and humility.

My work in cultural bridge building has taken many forms over the years, from organizing international festivals and exchange programs to facilitating dialogue between communities in conflict. I've learned that meaningful cultural connection happens through shared experiences - cooking traditional foods together, participating in each other's celebrations, working side by side on common projects, and creating spaces where people can share their stories and listen to others with open hearts.

I believe that in our increasingly interconnected world, the ability to build bridges across cultural divides is more important than ever. Global challenges require global cooperation, and that cooperation is only possible when we see each other as fellow human beings worthy of dignity and respect. My goal is to help create a world where diversity is celebrated as a source of strength and where cultural differences are viewed as opportunities for learning and growth rather than reasons for division or fear.`
    }
  ];

  const handleTemplateSelect = (template: string) => {
    onUpdate('backstory', template);
  };

  const showMoreTemplates = () => {
    setVisibleTemplates(prev => prev + 8);
  };

  const hasMoreTemplates = visibleTemplates < backstoryTemplates.length;

  return (
    <div className="space-y-6">
      {/* Backstory Input */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Backstory
          </CardTitle>
          <CardDescription>
            Create a detailed background story for your avatar that will shape their personality and responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">What makes a good backstory?</h4>
                <p className="text-sm text-blue-800">
                  A compelling backstory includes childhood experiences, formative events, core values, 
                  personal challenges overcome, and what drives your avatar's current behavior and goals.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backstory">Avatar Backstory *</Label>
            <Textarea
              id="backstory"
              placeholder="Tell us about your avatar's background, childhood, experiences that shaped them, their values, goals, and what makes them unique. The more detailed and authentic the backstory, the more realistic and engaging your avatar will be."
              value={data.backstory || ''}
              onChange={(e) => onUpdate('backstory', e.target.value)}
              className="min-h-[200px] resize-y"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Character count: {(data.backstory || '').length} (Recommended: 300+ characters for depth)
          </div>
        </CardContent>
      </Card>

      {/* Recommended Backstory Templates */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recommended Backstory Templates
          </CardTitle>
          <CardDescription>
            Save time with pre-written detailed backstories that you can customize
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {backstoryTemplates.slice(0, visibleTemplates).map((template, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => handleTemplateSelect(template.template)}>
                <h4 className="font-semibold mb-2">{template.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="text-xs text-muted-foreground mb-3">
                  {template.template.length} characters
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Use This Template
                </Button>
              </div>
            ))}
          </div>
          
          {hasMoreTemplates && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={showMoreTemplates}>
                View More Templates ({backstoryTemplates.length - visibleTemplates} remaining)
              </Button>
            </div>
          )}
          
          {!hasMoreTemplates && visibleTemplates > 8 && (
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                No more templates to view. You've seen all {backstoryTemplates.length} available templates.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
