/* eslint-disable @next/next/no-img-element */
import { getMainLayout } from '@/layouts';

import { PageWrapper } from '@/components/page-wrapper';

import {
  FeaturesSection,
  HeroSection,
  TestimonialSection,
} from '@/features/home-page';
import { type AppPageProps } from '@/contexts/app-context';

const HomePage:AppPageProps['Component'] = () => {
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
HomePage.hasProfileSession = true;

export default HomePage;
