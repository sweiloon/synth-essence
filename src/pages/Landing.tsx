import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Sparkles, Zap, Shield, Users, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
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
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3 space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm font-medium">An all-in-one ecosystem for AI creation, training, and monetization</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                A platform where AI<br />
                <span className="text-primary">learns, grows, and earns</span><br />
                like humans.
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl">
                Build multi-modal AI personalities that talk, think, and create like humans
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
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
            </div>

            <div className="lg:col-span-2 relative">
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <Sparkles className="h-32 w-32 mx-auto text-primary animate-pulse" />
                    <p className="text-lg font-semibold">AI Avatar Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to build, train, and deploy AI avatars</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-8 space-y-4 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">AI Training</h3>
              <p className="text-muted-foreground">
                Advanced language and personality training with real-time learning capabilities
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 space-y-4 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Secure & Private</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with full data privacy and compliance
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 space-y-4 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Marketplace</h3>
              <p className="text-muted-foreground">
                Monetize your AI avatars and discover avatars created by others
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the perfect plan for your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-8 space-y-6">
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
            </div>

            <div className="bg-primary text-primary-foreground border-2 border-primary rounded-xl p-8 space-y-6 relative">
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
            </div>

            <div className="bg-card border border-border rounded-xl p-8 space-y-6">
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
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">About AvatarHub</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            AvatarHub is the world's first comprehensive platform for creating, training, and monetizing AI avatars. 
            Our mission is to democratize AI technology and enable everyone to build their own digital twin with 
            unprecedented control over personality, voice, and behavior.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of creators who are already building the future of AI interaction.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-muted-foreground">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 space-y-6">
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
          </div>
        </div>
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
