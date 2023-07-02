/* eslint-disable @next/next/no-img-element */
import { withProfile } from '@/hoc/with-profile';
import { MainLayout } from '@/layouts';

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
