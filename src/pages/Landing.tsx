import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Sparkles, Zap, Shield, Users, Check, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { GridBackground } from '@/components/ui/grid-background';
import { StickyBanner } from '@/components/ui/sticky-banner';
import { motion } from 'framer-motion';
import FeaturesSection from '@/components/landing/FeaturesSection';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerClosed, setBannerClosed] = useState(false);

  React.useEffect(() => {
    const wasClosed = sessionStorage.getItem('sticky-banner-closed');
    setBannerClosed(wasClosed === 'true');
    
    // Listen for banner close events
    const handleBannerClose = () => setBannerClosed(true);
    window.addEventListener('banner-closed', handleBannerClose);
    return () => window.removeEventListener('banner-closed', handleBannerClose);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: true }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Banner */}
      <StickyBanner className="bg-gradient-to-b from-primary to-primary/80">
        <p className="mx-0 max-w-[90%] text-primary-foreground drop-shadow-md text-center text-sm md:text-base">
          🎉 Now available: Advanced AI Avatar Training Platform.{" "}
          <Link to="/dashboard" className="transition duration-200 hover:underline font-semibold">
            Get Started Free
          </Link>
        </p>
      </StickyBanner>

      {/* Header Navigation */}
      <header className={`fixed left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all duration-300 ${bannerClosed ? 'top-0' : 'top-14'}`}>
        <nav className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <span className="text-xl md:text-2xl font-bold">AvatarHub</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
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

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t border-border mt-4"
            >
              <div className="py-4 flex flex-col space-y-4">
                <a 
                  href="#features" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a 
                  href="#about" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
                <a 
                  href="#contact" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <div className="pt-4 border-t border-border space-y-2">
                  {user ? (
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        navigate('/dashboard');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        className="w-full" 
                        onClick={() => {
                          navigate('/auth');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Log in
                      </Button>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          navigate('/auth');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      {/* Hero Section with Aurora Background */}
      <section className={`transition-all duration-300 ${bannerClosed ? 'pt-16' : 'pt-28'}`}>
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 md:gap-6 items-center justify-center px-4 md:px-6 max-w-4xl mx-auto text-center"
          >
            {/* Label */}
            <div className="flex items-center gap-3 text-foreground">
              <div className="h-px w-12 bg-border"></div>
              <span className="text-xs md:text-sm uppercase tracking-wider font-light">
                An all-in-one ecosystem for AI creation, training, and monetization
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-foreground">
              A platform where AI learns,
              <br />
              grows, and earns like humans.
            </h1>

            {/* Subheading */}
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-medium max-w-2xl">
              Build multi-modal AI personalities that talk, think, and create like humans
            </p>

            {/* CTA Button */}
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-white/90 border-2 border-black text-base md:text-lg px-6 md:px-8 mt-2"
              onClick={() => navigate('/auth')}
            >
              Start now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4 bg-card px-4 py-2 rounded-full border border-border">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm md:text-base text-foreground font-medium">100+ Positive Client Reviews</span>
            </div>
          </motion.div>
        </AuroraBackground>
      </section>

      {/* Features Section - Directly after Hero */}
      <section id="features" className="bg-muted/30 -mt-1">
        <FeaturesSection />
      </section>

      {/* Details Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInLeft}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
                The Most Advanced AI Avatar Platform
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
                AvatarHub empowers creators and businesses to build sophisticated AI avatars with unprecedented control over personality, voice, and behavior. Join thousands of innovators shaping the future of digital interaction.
              </p>
              <Button size="lg" onClick={() => navigate('/auth')}>
                Get Started Now
              </Button>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4 md:gap-6"
            >
              <motion.div variants={fadeInUp} className="bg-card p-4 md:p-6 rounded-lg border border-border text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Active Users</div>
              </motion.div>
              <motion.div variants={fadeInUp} className="bg-card p-4 md:p-6 rounded-lg border border-border text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">150K+</div>
                <div className="text-xs md:text-sm text-muted-foreground">AI Avatars Created</div>
              </motion.div>
              <motion.div variants={fadeInUp} className="bg-card p-4 md:p-6 rounded-lg border border-border text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-xs md:text-sm text-muted-foreground">Uptime</div>
              </motion.div>
              <motion.div variants={fadeInUp} className="bg-card p-4 md:p-6 rounded-lg border border-border text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-xs md:text-sm text-muted-foreground">Support</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-20 px-4 md:px-6 bg-background -mt-1">
        <div className="container mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your needs. All plans include core features.
            </p>
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
      <section id="about" className="py-12 md:py-20 px-4 md:px-6 bg-muted/30">
        <motion.div {...fadeInUp} className="container mx-auto max-w-4xl text-center space-y-4 md:space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">About AvatarHub</h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            We're on a mission to democratize AI avatar technology. AvatarHub provides creators, businesses, and innovators with professional-grade tools to build, train, and deploy intelligent AI avatars that revolutionize digital interaction.
          </p>
          <Button size="lg" onClick={() => navigate('/auth')}>
            Join Our Community
          </Button>
        </motion.div>
      </section>

      {/* Contact Section with Grid Background */}
      <section id="contact" className="relative">
        <GridBackground>
          <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-20">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-4">
                Get In Touch
              </h2>
              <p className="text-base md:text-lg text-muted-foreground text-center mb-8">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>

              <form className="space-y-6 bg-card p-6 md:p-8 rounded-lg border border-border">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="request" className="block text-sm font-medium text-foreground mb-2">
                    Request
                  </label>
                  <textarea
                    id="request"
                    rows={4}
                    className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="Tell us about your request..."
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </GridBackground>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">AvatarHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Building the future of AI interaction, one avatar at a time.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/dashboard')}>Dashboard</Button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 AvatarHub. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
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
