/* eslint-disable @next/next/no-img-element */
import { withProfile } from '@/hoc/with-profile';
import { MainLayout } from '@/layouts';
import { Bell } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  FeaturesSection,
  HeroSection,
  TestimonialSection,
} from '@/features/home-page';

const HomePage = () => {
  return (
    <MainLayout>
      {/* Hero section */}
      <HeroSection />

      {/* Features section */}
      <FeaturesSection />

      {/* Testimonial section */}
      <TestimonialSection />

      {/* Pricing section */}

      {/* FAQ section */}
    </MainLayout>
  );
};

export default withProfile(HomePage);
