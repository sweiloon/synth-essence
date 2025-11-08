import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Menu, X, ArrowRight, Star, LogOut, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { ArrowRight, Star, Sparkles, Zap, Shield, Users, Check } from 'lucide-react';
=======
>>>>>>> 31a6900 (image error solved)
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuroraBackground } from '@/components/ui/aurora-background';
<<<<<<< HEAD
import { GridBackground } from '@/components/ui/grid-background';
import { motion } from 'framer-motion';
=======
import FeaturesSection from '@/components/landing/FeaturesSection';
import { GridBackground } from '@/components/ui/grid-background';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const plans = [
  {
    name: 'Free Tier',
    tag: 'Exploration',
    price: '$0',
    description: 'Testing and individual AI project development',
    highlight: false,
  },
  {
    name: 'Professional Tier',
    tag: 'Growth & Monetization',
    price: '$599',
    description: 'High-growth AI IP monetization projects and established brands',
    highlight: true,
  },
  {
    name: 'Enterprise Tier',
    tag: 'Scale & Customization',
    price: '$1,799',
    description: 'Large enterprises, customized deployment, and high-volume operations',
    highlight: false,
  },
];

const metrics = [
  { value: '50K+', label: 'Active Users' },
  { value: '150K+', label: 'AI Avatars Created' },
  { value: '99.9%', label: 'Platform Uptime' },
  { value: '24/7', label: 'Global Support' },
];

const pricingComparison = [
  {
    feature: 'AI Digital Human Creation Capacity',
    free: 'Limited to 1 active basic model',
    pro: '10 active models with enhanced creation',
    enterprise: 'Unlimited ultra-realistic creation',
  },
  {
    feature: 'Personality Agent Training Data',
    free: 'Basic pre-trained MBTI personalities',
    pro: '128 pre-trained MBTI personalities',
    enterprise: 'Bespoke fine-tuning based on real-person data',
  },
  {
    feature: 'Core AI Model Access',
    free: 'Basic chatbot, TTS, and limited image generation',
    pro: 'True-to-life Voice TTS and advanced image-to-image',
    enterprise: 'Premium face swapping technology for asset creation',
  },
  {
    feature: 'Intelligence and Learning Mode',
    free: 'Standard data input and localized training',
    pro: 'Agent + RAG training mode with long-term memory',
    enterprise: 'Automated learning evolution with vector databases',
  },
  {
    feature: 'Automation Workflow Platform',
    free: 'Foundational templates and automated tools',
    pro: 'CREATIQ AI fully automated platform',
    enterprise: 'Custom development and deployment service',
  },
  {
    feature: 'Deployment and Communication',
    free: '1 customer website for basic AI deployment',
    pro: '5 external platforms with WebRTC real-time communication',
    enterprise: 'Unlimited multi-domain deployment with low latency',
  },
  {
    feature: 'API Usage Quota',
    free: '1,000 monthly API calls',
    pro: '50,000 monthly high-volume API calls',
    enterprise: 'Unlimited high-priority API calls',
  },
  {
    feature: 'IP Commercialization & Revenue Share',
    free: 'Standard 30% platform revenue share for IP rental',
    pro: 'Priority listing with reduced 20% platform revenue share',
    enterprise: 'Strategic access with negotiable revenue share and NFT extension',
  },
  {
    feature: 'Support & Consulting',
    free: 'Community and email support',
    pro: 'Priority email and chat support',
    enterprise: 'Dedicated 24/7 account manager',
  },
];

const fadeInUp = {
  initial: { opacity: 0, translateY: 24 },
  animate: { opacity: 1, translateY: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};
>>>>>>> 31a6900 (image error solved)

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
<<<<<<< HEAD
=======
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to logout');
    } else {
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
>>>>>>> 31a6900 (image error solved)

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const renderNavLinks = (onClick?: () => void) => (
    <>
      <a
        href="#features"
        onClick={onClick}
        className="text-sm font-medium transition-colors hover:text-primary md:text-base"
      >
        Features
      </a>
      <a
        href="#pricing"
        onClick={onClick}
        className="text-sm font-medium transition-colors hover:text-primary md:text-base"
      >
        Pricing
      </a>
      <a
        href="#about"
        onClick={onClick}
        className="text-sm font-medium transition-colors hover:text-primary md:text-base"
      >
        About
      </a>
      <a
        href="#contact"
        onClick={onClick}
        className="text-sm font-medium transition-colors hover:text-primary md:text-base"
      >
        Contact
      </a>
    </>
  );

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">AvatarHub</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-9 w-9 cursor-pointer">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        Account Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/auth')}>
                    Log in
                  </Button>
                  <Button onClick={() => navigate('/auth')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
=======
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary md:h-8 md:w-8" />
            <span className="text-lg font-bold md:text-xl">AvatarHub</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">{renderNavLinks()}</div>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 cursor-pointer">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Log in
                </Button>
                <Button onClick={() => navigate('/auth')}>Get Started</Button>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
>>>>>>> 31a6900 (image error solved)
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/60 bg-background px-4 pb-6">
            <div className="flex flex-col gap-4 pt-4 text-sm font-medium">
              {renderNavLinks(closeMobileMenu)}
              <div className="flex flex-col gap-3 pt-4">
                {user ? (
                  <>
                    <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
                    <Button variant="outline" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => { navigate('/auth'); closeMobileMenu(); }}>
                      Log in
                    </Button>
                    <Button onClick={() => { navigate('/auth'); closeMobileMenu(); }}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

<<<<<<< HEAD
      {/* Hero Section with Aurora Background */}
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-8 items-center justify-center px-6 text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm font-medium">An all-in-one ecosystem for AI creation, training, and monetization</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-5xl">
            A platform where AI<br />
            <span className="text-primary">learns, grows, and earns</span><br />
            like humans.
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl">
            Build multi-modal AI personalities that talk, think, and create like humans
          </p>

          <div className="flex flex-col items-center gap-6">
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/auth')}>
              Start now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium">100+ Positive Client Reviews</span>
            </div>
          </div>
        </motion.div>
      </AuroraBackground>

      {/* Details Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div {...fadeInLeft} className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                From beginners to seasoned pros, I create custom plans{' '}
                <span className="text-muted-foreground">
                  tailored to help you unlock your full potential and succeed in races.
                </span>
              </h2>
            </motion.div>

            <motion.div {...fadeInRight}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-32 w-32 text-primary animate-pulse" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Statistics */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: '15+', label: 'Years of experience' },
              { number: '200+', label: 'Avatars created' },
              { number: '500+', label: 'AI strategies' },
              { number: '10,000+', label: 'Training hours' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center space-y-2 border-t border-border pt-4"
              >
                <div className="text-4xl md:text-5xl font-bold">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to build, train, and deploy AI avatars</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Zap,
                title: 'AI Training',
                description: 'Advanced language and personality training with real-time learning capabilities'
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Enterprise-grade security with full data privacy and compliance'
              },
              {
                icon: Users,
                title: 'Marketplace',
                description: 'Monetize your AI avatars and discover avatars created by others'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-card border border-border rounded-xl p-8 space-y-4 hover:shadow-lg transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the perfect plan for your needs</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="bg-card border border-border rounded-xl p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <p className="text-muted-foreground">Perfect for trying out</p>
              </div>
              <div className="text-4xl font-bold">$0<span className="text-lg text-muted-foreground">/mo</span></div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>1 AI Avatar</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Basic Training</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Community Support</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-primary text-primary-foreground border-2 border-primary rounded-xl p-8 space-y-6 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-primary-foreground/80">For serious creators</p>
              </div>
              <div className="text-4xl font-bold">$29<span className="text-lg text-primary-foreground/80">/mo</span></div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5" />
                  <span>10 AI Avatars</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5" />
                  <span>Advanced Training</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5" />
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5" />
                  <span>Marketplace Access</span>
                </li>
              </ul>
              <Button className="w-full bg-background text-foreground hover:bg-background/90" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-card border border-border rounded-xl p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-muted-foreground">For organizations</p>
              </div>
              <div className="text-4xl font-bold">Custom</div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Unlimited Avatars</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Custom Training</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>24/7 Support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>White Label</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" onClick={() => navigate('/auth')}>
                Contact Sales
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <motion.div {...fadeInUp} className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">About AvatarHub</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            AvatarHub is the world's first comprehensive platform for creating, training, and monetizing AI avatars. 
            Our mission is to democratize AI technology and enable everyone to build their own digital twin with 
            unprecedented control over personality, voice, and behavior.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of creators who are already building the future of AI interaction.
          </p>
        </motion.div>
      </section>

      {/* Contact Section with Grid Background */}
      <section id="contact" className="py-20 px-6">
        <GridBackground className="min-h-[600px] py-20">
          <div className="container mx-auto max-w-2xl">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
              <p className="text-xl text-muted-foreground">Have questions? We'd love to hear from you.</p>
            </motion.div>

            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-card border border-border rounded-xl p-8 space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <textarea 
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us what you're thinking..."
                />
              </div>
              <Button className="w-full" size="lg">
                Send Message
              </Button>
            </motion.div>
          </div>
        </GridBackground>
      </section>

      {/* Footer */}
=======
      <main className="flex-1">
        <section className="relative overflow-hidden bg-background">
          <AuroraBackground>
            <motion.div
              initial={{ opacity: 0, translateY: 28 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="container mx-auto flex flex-col items-center px-4 py-16 text-center md:px-6 md:py-20"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground shadow-sm md:text-sm">
                An all-in-one ecosystem for AI creation, training, and monetization
              </span>
              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-[3.6rem] lg:leading-[1.05]">
                A platform where AI learns, grows, and earns like humans.
              </h1>
              <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
                Build multi-modal AI personalities that talk, think, and create like humans.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3">
                <Button
                  size="lg"
                  className="group rounded-full bg-foreground px-8 text-background transition hover:bg-foreground/90"
                  onClick={() => navigate('/auth')}
                >
                  Start now
                  <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
                </Button>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                  <span className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <motion.span
                        key={index}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.12 }}
                      >
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow" />
                      </motion.span>
                    ))}
                  </span>
                  <span className="font-medium text-foreground">100+</span> Positive Client Reviews
                </div>
              </div>
            </motion.div>
          </AuroraBackground>
        </section>

        <section id="features" className="bg-background py-14 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center"
            >
              <h2 className="text-3xl font-bold md:text-4xl">Built for creators, teams, and enterprises</h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
                Design lifelike AI personas, train immersive voice models, and manage deployment from a single dashboard.
              </p>
            </motion.div>
            <div className="mt-10 overflow-hidden rounded-3xl border border-border/60 bg-muted/40">
              <FeaturesSection />
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-14 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-4">
              {metrics.map((metric) => (
                <motion.div
                  key={metric.label}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="rounded-2xl border border-border/60 bg-background/80 p-6 text-center shadow-sm"
                >
                  <p className="text-3xl font-bold md:text-4xl">{metric.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-background py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-primary md:text-sm">
                Pricing
              </span>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl lg:text-5xl">Compare our plans and find yours</h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
                Simple, transparent pricing that grows with you. Try any plan free for 30 days.
              </p>
            </motion.div>

            <div className="mt-10 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 p-1">
                <Button variant="outline" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm">
                  Monthly billing
                </Button>
                <Button variant="ghost" className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Annual billing
                </Button>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <motion.div
                  key={plan.name}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className={`flex h-full flex-col rounded-3xl border p-6 md:p-8 ${
                    plan.highlight
                      ? 'border-primary bg-primary/5 shadow-xl ring-1 ring-primary/20'
                      : 'border-border bg-card shadow-sm'
                  }`}
                >
                  {plan.highlight && (
                    <span className="w-fit rounded-full bg-primary px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow">
                      Popular
                    </span>
                  )}
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold md:text-2xl">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.tag}</p>
                  </div>
                  <div className="mt-6 text-4xl font-bold md:text-5xl">
                    {plan.price}
                    <span className="text-base font-medium text-muted-foreground"> / month</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-auto space-y-2 pt-6">
                    <Button className="w-full" onClick={() => navigate('/auth')}>
                      Get started
                    </Button>
                    <Button variant="outline" className="w-full">
                      Chat to sales
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            >
              <div className="border-b border-border/60 px-6 py-4 sm:px-8">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-primary">Overview</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm md:text-base">
                  <thead className="bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="py-3 pl-6 pr-3 text-sm font-semibold uppercase tracking-wide">Feature</th>
                      <th className="py-3 px-3 font-semibold text-foreground">Free</th>
                      <th className="py-3 px-3 font-semibold text-foreground">Professional</th>
                      <th className="py-3 px-6 font-semibold text-foreground">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pricingComparison.map((row) => (
                      <tr key={row.feature} className="align-top">
                        <td className="py-4 pl-6 pr-3 font-medium text-foreground">{row.feature}</td>
                        <td className="py-4 px-3 text-sm text-muted-foreground">{row.free}</td>
                        <td className="py-4 px-3 text-sm text-muted-foreground">{row.pro}</td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="bg-muted/30 py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mx-auto max-w-4xl text-center space-y-6"
            >
              <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">About AvatarHub</h2>
              <p className="text-base text-muted-foreground md:text-lg lg:text-xl">
                We&apos;re on a mission to democratize AI avatar technology. AvatarHub provides creators, businesses, and innovators with professional-grade tools to build, train, and deploy intelligent AI avatars that revolutionize digital interaction.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
                <Button size="lg" onClick={() => navigate('/auth')}>
                  Join our community
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/dashboard')}>
                  Explore the dashboard
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="bg-background py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <GridBackground className="rounded-3xl border border-border/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-12 text-slate-100 shadow-2xl md:px-10 md:py-16">
              <div className="relative z-20 mx-auto flex w-full flex-col gap-10 md:grid md:max-w-5xl md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md md:p-8"
                >
                  <h2 className="text-3xl font-bold text-white md:text-4xl">Let&apos;s build something extraordinary</h2>
                  <p className="mt-3 text-sm text-slate-300 md:text-base">
                    Share your goals and we&apos;ll help you launch AI avatars tailored to your brand and audience.
                  </p>
                  <div className="mt-6 space-y-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary-foreground">
                        <Mail className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">Email</p>
                        <a href="mailto:hello@avatarhub.ai" className="text-sm text-slate-300 transition hover:text-white">
                          hello@avatarhub.ai
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary-foreground">
                        <Phone className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">Phone</p>
                        <a href="tel:+15550000000" className="text-sm text-slate-300 transition hover:text-white">
                          +1 (555) 000-0000
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary-foreground">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">Office</p>
                        <p className="text-sm text-slate-300">
                          123 Innovation Drive
                          <br />
                          San Francisco, CA 94105
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 rounded-xl border border-white/20 bg-white/10 p-4 text-xs text-slate-200 md:text-sm">
                    <p className="font-medium text-white">Support hours</p>
                    <p>Monday – Friday · 9am – 6pm PST</p>
                    <p>Average response time: under 24 hours</p>
                  </div>
                </motion.div>

                <motion.form
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="rounded-2xl border border-white/10 bg-white p-6 text-foreground shadow-xl md:p-8"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Name</Label>
                      <Input
                        id="contact-name"
                        placeholder="Your name"
                        required
                        className="bg-slate-100 text-foreground placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Phone Number</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        required
                        className="bg-slate-100 text-foreground placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="bg-slate-100 text-foreground placeholder:text-slate-400"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="contact-request">Request</Label>
                    <Textarea
                      id="contact-request"
                      rows={5}
                      placeholder="Tell us about your project or questions..."
                      required
                      className="bg-slate-100 text-foreground placeholder:text-slate-400"
                    />
                  </div>
                  <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground sm:max-w-xs">
                      We respect your privacy. Your details are used only to respond to this enquiry.
                    </p>
                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      Send message
                    </Button>
                  </div>
                </motion.form>
              </div>
            </GridBackground>
          </div>
        </section>
      </main>

>>>>>>> 31a6900 (image error solved)
      <footer className="border-t border-border bg-muted/30 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">AvatarHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Building the future of AI interaction, one avatar at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="transition-colors hover:text-primary">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="transition-colors hover:text-primary">
                    Pricing
                  </a>
                </li>
                <li>
                  <Button variant="link" className="p-0 text-sm" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#about" className="transition-colors hover:text-primary">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="transition-colors hover:text-primary">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-primary">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-primary">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-primary">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-primary">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row">
            <p>© {new Date().getFullYear()} AvatarHub. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="transition-colors hover:text-primary">
                Twitter
              </a>
              <a href="#" className="transition-colors hover:text-primary">
                LinkedIn
              </a>
              <a href="#" className="transition-colors hover:text-primary">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
