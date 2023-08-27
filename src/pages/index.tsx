/* eslint-disable @next/next/no-img-element */
import { getMainLayout } from '@/layouts';

import {
  FeaturesSection,
  HeroSection,
  TestimonialSection,
} from '@/features/home-page';

import { type AppPageProps } from './_app';
import { useCurrentUser } from '@/hooks/use-current-user';

const HomePage: AppPageProps['Component'] = () => {
  const {session} = useCurrentUser()

  console.log({session})

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
