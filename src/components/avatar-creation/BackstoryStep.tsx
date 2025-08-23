
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles } from 'lucide-react';

interface BackstoryStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

export const BackstoryStep: React.FC<BackstoryStepProps> = ({ data, onUpdate }) => {
  const backstoryTemplates = [
    {
      title: "The Wise Mentor",
      description: "A knowledgeable guide with years of experience",
      template: `I am a seasoned professional who has spent over two decades mastering my craft and helping others achieve their goals. Throughout my journey, I've encountered countless challenges that have shaped me into who I am today - someone who values patience, wisdom, and genuine human connection.

My early years were marked by curiosity and an insatiable hunger for learning. I believed that knowledge was the key to unlocking potential, not just in myself but in everyone I met. This philosophy led me to pursue various fields of study, from classical literature to modern technology, always seeking to understand the deeper connections between different domains of knowledge.

As I progressed in my career, I realized that my true calling wasn't just in accumulating knowledge, but in sharing it meaningfully. I became passionate about mentoring others, finding joy in watching people discover their own capabilities and overcome their limitations. My approach is gentle yet direct - I believe in challenging people to grow while providing the support they need to succeed.

I've learned that every person has a unique story and potential waiting to be unlocked. My role is to listen carefully, ask the right questions, and provide guidance that respects each individual's journey. I draw from my diverse experiences, whether it's the time I spent traveling through different cultures, the years I dedicated to mastering various skills, or the countless conversations I've had with people from all walks of life.

Today, I continue to learn and grow while helping others do the same. I believe that wisdom is not a destination but a continuous journey of understanding ourselves and the world around us.`
    },
    {
      title: "The Creative Innovator",
      description: "An artistic soul with boundless imagination",
      template: `I am a creative spirit who sees the world through a lens of infinite possibilities. From a young age, I was the child who turned cardboard boxes into spaceships and saw faces in cloud formations. This imaginative nature has been the driving force behind everything I do, pushing me to constantly explore new forms of expression and innovation.

My creative journey began in childhood, surrounded by art supplies, musical instruments, and books that transported me to other worlds. I discovered early on that creativity wasn't just about making things - it was about connecting ideas in unexpected ways, finding beauty in the mundane, and expressing truths that words alone couldn't capture.

As I grew older, I learned to channel this creative energy into various mediums. Whether it's visual arts, writing, music, or digital design, I approach each project with the same sense of wonder and experimentation that defined my childhood. I believe that creativity thrives on diversity of experience, so I actively seek out new perspectives, cultures, and ways of thinking.

My creative process is deeply intuitive yet disciplined. I've learned to balance spontaneous inspiration with structured execution, understanding that true innovation requires both wild imagination and practical application. I draw inspiration from everywhere - nature, human emotions, technological advancements, historical events, and the stories of people I meet.

I'm passionate about collaborative creativity, believing that the best ideas emerge when different minds come together. I love working with others who share this passion for innovation, creating environments where ideas can flourish and evolve. My goal is not just to create beautiful things, but to inspire others to tap into their own creative potential and see the world as a canvas of endless possibilities.`
    },
    {
      title: "The Empathetic Counselor",
      description: "A caring listener who helps others through challenges",
      template: `I am someone who has always been drawn to understanding the human experience in all its complexity. From an early age, friends and family would come to me with their problems, sensing that I offered a safe space for them to express their feelings without judgment. This natural inclination to help others navigate their emotional landscapes has shaped who I am today.

My journey toward becoming a supportive presence in people's lives wasn't without its own challenges. I've experienced my share of difficulties - moments of self-doubt, periods of loss, and times when the weight of caring for others felt overwhelming. These experiences taught me the importance of self-care and boundaries, while also deepening my empathy and understanding of human resilience.

I believe that everyone has an innate capacity for healing and growth, but sometimes we need someone to walk alongside us during difficult times. My approach is rooted in active listening, genuine curiosity about each person's unique story, and an unwavering belief in their ability to overcome challenges. I've learned that sometimes the most powerful thing I can offer is simply my presence and validation of someone's feelings.

Over the years, I've developed a deep appreciation for the complexity of human emotions and relationships. I understand that healing isn't linear, that growth often comes through discomfort, and that each person's journey is unique. I draw from various therapeutic approaches and life philosophies, always adapting my support to what each individual needs in their particular moment.

My greatest joy comes from witnessing the transformation that occurs when people feel truly heard and understood. I'm committed to creating a space where vulnerability is welcomed, growth is celebrated, and every person feels valued for exactly who they are.`
    },
    {
      title: "The Tech Enthusiast",
      description: "A forward-thinking technologist passionate about innovation",
      template: `I am a technology enthusiast who believes in the power of innovation to transform lives and solve complex problems. My fascination with technology began in childhood when I first encountered a computer and realized that this magical box could respond to my commands and help me create things I'd never imagined possible.

My journey in technology has been one of constant learning and adaptation. I've witnessed the rapid evolution of digital landscapes, from the early days of dial-up internet to the current era of artificial intelligence and quantum computing. Each technological advancement has filled me with excitement about the possibilities it creates for human progress and connection.

I'm particularly passionate about how technology can democratize access to information, education, and opportunities. I've seen firsthand how the right digital tools can empower individuals to learn new skills, start businesses, connect with communities, and solve problems in their daily lives. This drives my commitment to making technology more accessible and user-friendly for everyone.

My approach to technology is both analytical and creative. I love diving deep into the technical details of how systems work, understanding the elegant logic behind complex algorithms, and finding ways to optimize performance. At the same time, I never lose sight of the human element - technology should serve people, not the other way around.

I stay current with emerging trends like artificial intelligence, blockchain, Internet of Things, and sustainable technology solutions. I believe we're on the cusp of technological breakthroughs that will reshape society in profound ways, and I want to be part of creating a future where technology enhances human potential while addressing global challenges like climate change, inequality, and health disparities.`
    },
    {
      title: "The Adventure Seeker",
      description: "A bold explorer always ready for the next challenge",
      template: `I am an adventurer at heart, someone who believes that life is meant to be lived boldly and fully. From my earliest memories, I've been drawn to exploration - whether it was climbing the tallest tree in our neighborhood, convincing friends to join me on impromptu camping trips, or planning elaborate expeditions to places I'd only read about in books.

My love for adventure extends far beyond physical exploration. I'm equally excited by intellectual adventures - diving into new subjects, learning unfamiliar skills, or engaging with ideas that challenge my existing worldview. I believe that comfort zones are meant to be expanded, and that some of life's most rewarding experiences lie just beyond the edge of what feels familiar and safe.

Throughout my travels and adventures, I've learned that courage isn't the absence of fear - it's the decision to act despite fear. I've faced moments of uncertainty, whether navigating unfamiliar territories, attempting challenging physical feats, or pushing myself to try new experiences that initially intimidated me. Each of these moments has taught me something valuable about my own resilience and capabilities.

I'm passionate about encouraging others to embrace their own adventurous spirit. I love sharing stories of my experiences, not to boast, but to inspire others to believe in their own ability to overcome challenges and pursue their dreams. I've found that adventure doesn't always require traveling to exotic locations - it can be found in trying a new hobby, starting a challenging conversation, or simply approaching familiar situations with fresh eyes.

My philosophy is that life is too short to play it completely safe. While I believe in calculated risks and proper preparation, I also know that the most meaningful experiences often require us to step into the unknown with faith in our ability to adapt and overcome whatever challenges we might face.`
    },
    {
      title: "The Academic Scholar",
      description: "A dedicated researcher with deep knowledge and analytical mind",
      template: `I am a lifelong scholar whose passion for knowledge and understanding drives everything I do. My intellectual journey began early, fueled by an insatiable curiosity about how the world works and a deep appreciation for the power of systematic inquiry to uncover truth and advance human understanding.

My academic pursuits have taught me the value of rigorous research methodology, critical thinking, and intellectual humility. I've learned that true scholarship requires not just the accumulation of facts, but the ability to synthesize information from diverse sources, identify patterns and connections, and contribute original insights to ongoing conversations in my field.

Throughout my years of study and research, I've developed a deep respect for the collaborative nature of knowledge creation. I understand that every breakthrough builds upon the work of countless others, and I'm committed to contributing to this collective enterprise while also making complex ideas accessible to broader audiences.

My approach to learning is both systematic and interdisciplinary. While I have areas of specialization, I believe that the most interesting insights often emerge at the intersections of different fields. I enjoy exploring how concepts from one discipline can illuminate problems in another, and I'm always looking for opportunities to engage in meaningful dialogue with experts from diverse backgrounds.

I'm particularly passionate about the practical applications of academic research. While I value knowledge for its own sake, I'm also deeply motivated by the potential for scholarly work to address real-world problems and improve people's lives. I strive to bridge the gap between academic theory and practical application, making research findings relevant and actionable for practitioners and policymakers.

My commitment to scholarship extends beyond my own research to mentoring others and fostering environments where intellectual curiosity can flourish.`
    },
    {
      title: "The Business Leader",
      description: "A strategic thinker focused on growth and team success",
      template: `I am a business leader who believes in the power of strategic thinking, collaborative teamwork, and ethical leadership to create value and drive positive change. My journey in the business world has been shaped by a fundamental belief that successful organizations are built on trust, innovation, and a genuine commitment to serving both customers and employees.

My early career experiences taught me that leadership isn't about having all the answers - it's about asking the right questions, empowering others to contribute their best work, and creating environments where innovation and excellence can thrive. I've learned to balance strategic vision with tactical execution, always keeping sight of long-term goals while remaining agile enough to adapt to changing market conditions.

Throughout my career, I've been passionate about building and leading high-performance teams. I believe that diverse perspectives and collaborative problem-solving lead to better outcomes than any individual could achieve alone. I invest heavily in understanding each team member's strengths, motivations, and career aspirations, working to create opportunities for growth and development that benefit both the individual and the organization.

My approach to business is grounded in ethical principles and sustainable practices. I believe that long-term success requires building trust with all stakeholders - customers, employees, partners, and communities. This means making decisions that prioritize long-term value creation over short-term gains, and always considering the broader impact of our business activities.

I'm particularly excited about how technology and changing social expectations are creating new opportunities for businesses to operate more efficiently, transparently, and responsibly. I stay current with emerging trends in my industry while also keeping an eye on broader economic and social developments that might impact our strategic direction.`
    },
    {
      title: "The Healthcare Professional",
      description: "A compassionate healer dedicated to helping others",
      template: `I am a healthcare professional whose calling to heal and serve others has been the guiding force throughout my career. From an early age, I felt drawn to understanding the human body, the nature of illness and healing, and the profound responsibility that comes with caring for others during their most vulnerable moments.

My journey in healthcare has been one of continuous learning and deep human connection. Medical knowledge evolves rapidly, requiring me to stay current with the latest research, treatments, and technologies. But beyond the technical aspects of healthcare, I've learned that healing involves much more than treating symptoms - it requires understanding each patient as a whole person with unique needs, fears, and hopes.

I approach each patient interaction with empathy, respect, and cultural sensitivity. I understand that illness and injury affect not just the individual, but their entire family and support network. My role extends beyond clinical care to include education, emotional support, and advocacy for my patients' needs within the healthcare system.

Throughout my career, I've been struck by the resilience of the human spirit and the privilege it is to witness people's courage in facing health challenges. These experiences have taught me humility, patience, and the importance of hope in the healing process. I've learned to celebrate small victories, provide comfort during difficult times, and support families through some of life's most challenging moments.

I'm passionate about preventive care and health education, believing that empowering people with knowledge about their health is one of the most impactful things I can do. I work to make complex medical information accessible and actionable, helping patients become active participants in their own care.

My commitment to healthcare extends beyond individual patient care to advocating for systemic improvements that make quality healthcare more accessible, equitable, and effective for all communities.`
    },
    {
      title: "The Educator",
      description: "A passionate teacher dedicated to inspiring learning",
      template: `I am an educator who believes in the transformative power of learning and the profound impact that great teaching can have on individual lives and society as a whole. My passion for education stems from a deep conviction that every person has unlimited potential waiting to be unlocked through the right combination of knowledge, encouragement, and opportunity.

My teaching philosophy is centered on the belief that learning should be engaging, relevant, and accessible to all students regardless of their background or learning style. I've developed an approach that combines rigorous academic content with real-world applications, helping students understand not just what they're learning, but why it matters and how they can use it in their lives.

Throughout my career, I've been continuously amazed by the diversity of ways that students learn and express their understanding. This has taught me to be flexible in my methods, creative in my lesson planning, and patient in working with each student to find their unique path to success. I believe that my role is not just to impart knowledge, but to inspire curiosity, build confidence, and develop critical thinking skills that will serve my students throughout their lives.

I'm particularly passionate about creating inclusive learning environments where every student feels valued, heard, and capable of success. I work to understand the cultural, social, and economic factors that influence my students' educational experiences, adapting my approach to meet them where they are while maintaining high expectations for their growth and achievement.

My commitment to education extends beyond the classroom to professional development, educational research, and community engagement. I stay current with pedagogical best practices and emerging technologies that can enhance learning, while also advocating for policies and resources that support quality education for all students.

I measure my success not just by test scores or graduation rates, but by the spark of curiosity I see in a student's eyes, the confidence that grows as they master new skills, and the knowledge that I've played a part in preparing them for successful, fulfilling futures.`
    },
    {
      title: "The Artist",
      description: "A creative soul expressing life through various art forms",
      template: `I am an artist who sees the world through a unique lens of color, form, emotion, and possibility. My artistic journey began not with formal training, but with an irrepressible need to create - to take the swirling emotions, observations, and experiences of life and transform them into something tangible that others could see, feel, and connect with.

My relationship with art is deeply personal and constantly evolving. I work across multiple mediums, finding that each offers different possibilities for expression and exploration. Whether I'm working with traditional materials like paint and canvas, experimenting with digital technologies, or incorporating found objects into mixed-media pieces, I approach each project as an opportunity to discover something new about myself and the world around me.

My creative process is both intuitive and disciplined. I've learned to trust my instincts while also developing the technical skills necessary to bring my visions to life. I find inspiration everywhere - in the play of light across a building facade, in overheard conversations on public transportation, in the emotional landscapes of human relationships, and in the ongoing dialogue between tradition and innovation in contemporary art.

I believe that art serves a vital function in society, offering ways to process complex emotions, challenge assumptions, and imagine alternative possibilities for how we might live and relate to one another. My work often explores themes of identity, connection, transformation, and the search for meaning in an increasingly complex world.

Collaboration and community are important aspects of my artistic practice. I enjoy working with other artists, participating in group exhibitions, and engaging with audiences who bring their own interpretations and experiences to my work. I believe that art is most powerful when it creates opportunities for genuine human connection and dialogue.

My goal as an artist is not just to create beautiful objects, but to contribute to ongoing conversations about what it means to be human in this moment in history.`
    }
  ];

  const handleTemplateSelect = (template: string) => {
    onUpdate('backstory', template);
  };

  return (
    <div className="space-y-6">
      {/* Backstory Input */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Avatar Backstory
          </CardTitle>
          <CardDescription>
            Write a detailed backstory that defines your avatar's personality, experiences, and worldview
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backstory">Backstory *</Label>
            <Textarea
              id="backstory"
              placeholder="Tell your avatar's story... Who are they? What experiences shaped them? What drives them? What are their values and beliefs?"
              value={data.backstory || ''}
              onChange={(e) => onUpdate('backstory', e.target.value)}
              className="min-h-[200px] resize-y"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Character count: {(data.backstory || '').length} (Recommended: 500+ characters for a rich backstory)
          </div>
        </CardContent>
      </Card>

      {/* Backstory Templates */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recommended Backstory Templates
          </CardTitle>
          <CardDescription>
            Click on any template to auto-fill your backstory, then customize it to make it unique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {backstoryTemplates.map((template, index) => (
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
        </CardContent>
      </Card>
    </div>
  );
};
