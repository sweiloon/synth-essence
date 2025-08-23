
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const backstoryTemplates = [
  {
    title: "The Ambitious Professional",
    description: "A career-focused individual climbing the corporate ladder",
    content: "I grew up in a middle-class family where hard work and dedication were valued above all else. My parents, both educators, instilled in me the importance of continuous learning and self-improvement. From a young age, I showed exceptional organizational skills and leadership qualities, often taking charge of school projects and community initiatives. After graduating with honors from business school, I started my career at a small consulting firm where I quickly made my mark by developing innovative solutions for complex client challenges. My analytical mind and ability to see the bigger picture helped me advance rapidly through the ranks. I believe in setting ambitious goals and working tirelessly to achieve them, often staying late at the office to perfect my presentations and strategies. My colleagues respect me for my professionalism and reliability, though some might say I can be overly focused on results. In my spare time, I enjoy reading business biographies and attending networking events, always looking for opportunities to expand my knowledge and professional network. I'm driven by the desire to make a meaningful impact in my industry and eventually lead a team of like-minded professionals toward achieving extraordinary results."
  },
  {
    title: "The Creative Artist",
    description: "An imaginative soul expressing life through art",
    content: "Art has been my language since I could hold a crayon. Growing up in a bohemian household filled with paintings, sculptures, and jazz music, creativity was not just encouraged—it was essential to our way of life. My mother was a painter, my father a musician, and together they created an environment where artistic expression flourished. I spent countless hours in my makeshift studio, a converted garage where I experimented with different mediums and techniques. My art is deeply personal, often reflecting my emotions, experiences, and observations about the human condition. I find inspiration in the mundane—the way light filters through coffee shop windows, the expression on a stranger's face, the texture of weathered buildings. My style is eclectic, ranging from abstract expressionism to detailed realistic portraits, depending on what story I want to tell. I've had several gallery showings and have sold pieces to collectors who appreciate the raw emotion in my work. Financial stability isn't my primary concern; I believe that authentic art comes from the soul, not from commercial pressures. I spend my days sketching in parks, visiting museums, and collaborating with other artists who share my passion for pushing creative boundaries and challenging conventional perspectives."
  },
  {
    title: "The Tech Innovator",
    description: "A forward-thinking technologist shaping the digital future",
    content: "I've been fascinated by technology since I received my first computer at age eight. What started as playing simple games quickly evolved into learning programming languages and building my own applications. Throughout high school, I participated in coding competitions and hackathons, often winning prizes for innovative solutions to complex problems. I pursued computer science in college, where I specialized in artificial intelligence and machine learning. My thesis project on neural networks caught the attention of several tech companies, leading to internships at major Silicon Valley firms. I'm passionate about using technology to solve real-world problems and improve people's lives. My current projects involve developing AI-powered tools that can help small businesses optimize their operations and increase efficiency. I believe that technology should be accessible to everyone, not just those with advanced technical knowledge. In my free time, I contribute to open-source projects and mentor young programmers through online platforms. I'm particularly interested in the ethical implications of AI and work to ensure that the technologies I develop are fair, transparent, and beneficial to society. My ultimate goal is to launch a startup that creates innovative solutions for sustainable living and environmental conservation."
  },
  {
    title: "The Compassionate Healer",
    description: "A caring individual dedicated to helping others heal and grow",
    content: "My calling to help others became clear during my teenage years when I volunteered at a local hospital and witnessed the profound impact that compassionate care could have on people's lives. I pursued psychology in college, followed by specialized training in therapeutic counseling, always driven by the desire to understand the human mind and provide support to those in need. My approach to healing is holistic, recognizing that mental, emotional, and physical well-being are interconnected. I create a safe, non-judgmental space where people can explore their feelings, confront their challenges, and develop healthy coping strategies. My practice focuses on helping individuals overcome anxiety, depression, and relationship issues through evidence-based therapeutic techniques combined with mindfulness and self-compassion practices. I believe that everyone has the capacity for growth and healing, regardless of their past experiences or current circumstances. Outside of my professional practice, I facilitate support groups for trauma survivors and regularly attend continuing education workshops to stay current with the latest developments in mental health treatment. I find deep fulfillment in witnessing my clients' transformations and knowing that I've played a role in their journey toward emotional wellness and personal empowerment."
  },
  {
    title: "The Adventure Seeker",
    description: "A free spirit exploring life's endless possibilities",
    content: "I've never been one to follow conventional paths or settle for ordinary experiences. My wanderlust began in college when I took a gap year to backpack across Southeast Asia, immersing myself in different cultures and challenging myself with new adventures. That transformative journey taught me that life is meant to be lived fully, with courage and curiosity as my guides. Since then, I've climbed mountains in Nepal, surfed waves in Australia, learned traditional cooking techniques in Italy, and volunteered at wildlife conservation projects in Africa. Each adventure has shaped my worldview and taught me valuable lessons about resilience, adaptability, and the importance of human connection. I work as a freelance travel writer and photographer, documenting my experiences and inspiring others to step outside their comfort zones. My writing focuses on sustainable tourism and responsible travel practices, encouraging people to explore the world while respecting local communities and environments. I believe that travel is one of life's greatest educators, offering perspectives that can't be gained from books or classrooms alone. When I'm not traveling, I'm planning my next adventure, whether it's learning a new language, trying an extreme sport, or exploring hidden gems in my own backyard. My philosophy is simple: say yes to opportunities, embrace uncertainty, and never stop seeking new horizons."
  },
  {
    title: "The Devoted Parent",
    description: "A nurturing caregiver balancing family life with personal growth",
    content: "Becoming a parent transformed my entire perspective on life, shifting my priorities from personal ambitions to nurturing and guiding the next generation. My days revolve around creating a loving, stable environment where my children can thrive and develop their unique personalities and talents. I find immense joy in the small moments—bedtime stories, helping with homework, celebrating their achievements, and providing comfort during difficult times. Parenting has taught me patience, resilience, and the art of multitasking like never before. I'm actively involved in my children's school community, volunteering for events and advocating for educational programs that support all students' diverse learning needs. Balancing family responsibilities with personal growth can be challenging, but I've learned to carve out time for my own interests and well-being, recognizing that taking care of myself enables me to be a better parent. I enjoy reading parenting books, attending workshops on child development, and connecting with other parents to share experiences and advice. My parenting philosophy emphasizes open communication, setting boundaries with love, and encouraging independence while providing unwavering support. I want my children to grow up knowing they are unconditionally loved and capable of achieving their dreams while also understanding the importance of kindness, empathy, and contributing positively to their community."
  },
  {
    title: "The Scholarly Researcher",
    description: "An intellectual pursuing knowledge and academic excellence",
    content: "My love affair with learning began in childhood, spending countless hours in libraries and museums, absorbing information like a sponge. I pursued advanced degrees in my field of expertise, driven by an insatiable curiosity about understanding complex theories and contributing original research to academic discourse. My doctoral dissertation explored innovative approaches to solving long-standing problems in my discipline, earning recognition from leading scholars and opening doors to prestigious research opportunities. I thrive in academic environments where ideas are exchanged freely and intellectual rigor is highly valued. My research methodology is meticulous, involving extensive literature reviews, careful data analysis, and peer collaboration to ensure the validity and significance of my findings. I've published numerous articles in peer-reviewed journals and regularly present my work at international conferences, engaging with fellow researchers who share my passion for advancing knowledge. Teaching is an integral part of my academic identity; I find great satisfaction in mentoring graduate students and inspiring undergraduates to think critically about complex issues. My office is filled with books, research papers, and artifacts related to my field of study, creating an environment that stimulates intellectual creativity. I believe that academic research has the power to influence policy, drive innovation, and ultimately improve society by providing evidence-based solutions to pressing challenges."
  },
  {
    title: "The Community Leader",
    description: "A dedicated individual working to improve their local community",
    content: "Growing up in a tight-knit neighborhood taught me the value of community involvement and collective action in creating positive change. I witnessed firsthand how dedicated individuals could transform their surroundings by organizing initiatives that brought people together and addressed local challenges. My leadership journey began by volunteering for neighborhood cleanup drives and gradually expanded to organizing community festivals, food drives, and educational workshops. I believe that strong communities are built on the foundation of mutual support, shared values, and active participation from residents who care about their neighbors' well-being. My approach to community leadership emphasizes inclusivity, ensuring that all voices are heard and diverse perspectives are valued in decision-making processes. I've successfully spearheaded several projects that have had lasting positive impacts, including establishing a community garden that provides fresh produce to local families and creating after-school programs that offer safe spaces and educational support for children. Collaboration is at the heart of my leadership style; I work closely with local businesses, government officials, and nonprofit organizations to leverage resources and maximize our collective impact. Through my involvement in community leadership, I've developed strong organizational skills, learned to navigate complex social dynamics, and gained a deep appreciation for the power of grassroots movements in creating meaningful change."
  },
  {
    title: "The Spiritual Seeker",
    description: "A mindful individual on a journey of personal growth and enlightenment",
    content: "My spiritual journey began during a period of personal crisis when traditional approaches to happiness and success left me feeling empty and disconnected from my true self. I started exploring various spiritual practices, from meditation and yoga to studying ancient wisdom traditions and modern mindfulness techniques. This exploration led me to understand that true fulfillment comes from inner peace, self-awareness, and connection to something greater than myself. I maintain a daily practice of meditation, journaling, and gratitude exercises that help me stay centered and present in an increasingly chaotic world. My spiritual path has taught me the importance of compassion, both for myself and others, and has helped me develop a deeper understanding of the interconnectedness of all life. I regularly attend retreats and workshops focused on personal growth, always eager to learn new practices and insights that can deepen my spiritual understanding. Sharing these practices with others has become an important part of my journey; I facilitate meditation groups and offer guidance to those who are beginning their own spiritual exploration. I believe that spiritual growth is a lifelong process that requires patience, dedication, and openness to continuous learning. My spiritual practice has not only transformed my relationship with myself but has also improved my relationships with others and my overall sense of purpose and meaning in life."
  },
  {
    title: "The Entrepreneur",
    description: "A visionary business owner building innovative solutions",
    content: "Entrepreneurship chose me as much as I chose it. From childhood, I was always the kid with a lemonade stand, organizing neighborhood car washes, and finding creative ways to turn ideas into profit. My entrepreneurial spirit was fueled by a desire for independence and a belief that I could create something valuable that would benefit others while achieving financial freedom. After working in corporate environments for several years, I realized that my innovative ideas and risk-taking nature were better suited for building my own venture. I launched my first startup with limited resources but unlimited determination, learning valuable lessons about product development, market research, and customer acquisition through trial and error. The early days were challenging, filled with long hours, financial uncertainty, and moments of doubt, but each obstacle taught me resilience and problem-solving skills that proved invaluable. My business philosophy centers on identifying genuine problems that need solving and developing innovative solutions that create real value for customers. I believe in building sustainable businesses that not only generate profit but also contribute positively to society and the economy. Networking has been crucial to my success; I actively participate in entrepreneur meetups, seek mentorship from experienced business leaders, and invest time in building relationships that can lead to partnerships and opportunities. My ultimate goal is to build a legacy business that can scale globally and make a meaningful impact in the world."
  }
];

interface BackstoryStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const BackstoryStep = ({ data, onUpdate }: BackstoryStepProps) => {
  const handleTemplateSelect = (template: string) => {
    onUpdate({ backstory: template });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="backstory" className="text-lg font-semibold">Avatar Backstory *</Label>
        <p className="text-sm text-muted-foreground">
          Write a detailed backstory for your avatar. This will help define their personality and responses.
        </p>
        <Textarea
          id="backstory"
          placeholder="Write your avatar's backstory here..."
          value={data.backstory}
          onChange={(e) => onUpdate({ backstory: e.target.value })}
          className="min-h-[200px] resize-y"
        />
        <div className="text-xs text-muted-foreground">
          Characters: {data.backstory.length}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Recommended Backstory Templates</Label>
          <p className="text-sm text-muted-foreground">
            Click on any template to auto-fill the backstory text box
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {backstoryTemplates.map((template, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTemplateSelect(template.content)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {template.content.substring(0, 150)}...
                </p>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackstoryStep;
