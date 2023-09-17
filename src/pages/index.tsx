import {
  FeaturesSection,
  HeroSection,
  TestimonialSection,
} from '@/features/home-page';

import { type AppPageProps } from './_app';

const HomePage: AppPageProps['Component'] = () => {
  return (
    <>
      {/* Hero section */}
      <HeroSection />

      {/* Features section */}
      <FeaturesSection />

      {/* Testimonial section */}
      <TestimonialSection />
    </>
  );
};

export default HomePage;
