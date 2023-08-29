/* eslint-disable @next/next/no-img-element */
import { getMainLayout } from '@/layouts';

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

HomePage.getLayout = getMainLayout;

export default HomePage;
