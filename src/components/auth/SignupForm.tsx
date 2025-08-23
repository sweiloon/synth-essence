
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, Chrome, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { PhoneInput } from '@/components/ui/phone-input';

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSignupSuccess: () => void;
}

const SignupForm = ({ onSwitchToLogin, onSignupSuccess }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: '+60',
    phoneNumber: '',
    referrerCode: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const phoneNumber = formData.phoneNumber ? `${formData.countryCode}${formData.phoneNumber}` : '';
      
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        formData.name,
        phoneNumber,
        formData.referrerCode
      );
      
      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Welcome to AvatarHub. Please check your email to verify your account.",
        });
        // Auto redirect to login page after successful signup
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Sign Up Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast({
      title: "Google Authentication",
      description: "Google auth integration will be implemented with backend.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold">AvatarHub</h1>
        <p className="text-muted-foreground">Your AI Avatar Station</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Create Account</h2>
        <p className="text-muted-foreground text-sm">
          Join us to start building your AI avatar
        </p>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="pl-10 input-modern"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10 input-modern"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <PhoneInput
            countryCode={formData.countryCode}
            phoneNumber={formData.phoneNumber}
            onCountryCodeChange={(value) => handleInputChange('countryCode', value)}
            onPhoneNumberChange={(value) => handleInputChange('phoneNumber', value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="pl-10 input-modern"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="pl-10 input-modern"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referrerCode">Referrer Code (Optional)</Label>
          <Input
            id="referrerCode"
            type="text"
            placeholder="Enter referrer code if you have one"
            value={formData.referrerCode}
            onChange={(e) => handleInputChange('referrerCode', e.target.value)}
            className="input-modern"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
          />
          <Label htmlFor="terms" className="text-sm">
            I agree to the{' '}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full btn-hero"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <Separator />
        <div className="absolute inset-0 flex justify-center">
          <span className="bg-background px-2 text-xs text-muted-foreground">
            OR
          </span>
        </div>
      </div>

      {/* Google Auth */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleAuth}
      >
        <Chrome className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>

      {/* Switch to Login */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary font-medium hover:underline"
        >
          Sign in here
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
