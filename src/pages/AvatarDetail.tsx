import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AvatarDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard', { state: { activeSection: 'marketplace' } })}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Button>
            <h1 className="text-2xl font-bold">Avatar Detail</h1>
            <div className="w-32" /> {/* Spacer */}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Placeholder for Avatar Detail Content */}
          <p>Avatar ID: {id}</p>
          <p>Details for this avatar will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default AvatarDetail;
