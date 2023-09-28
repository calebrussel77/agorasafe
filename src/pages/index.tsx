import {
  FeaturesSection,
  HeroSection,
  TestimonialSection,
} from '@/features/home-page';
import {
  DEFAULT_SERVICE_REQUESTS_LIMIT,
  ServiceRequestsSection,
} from '@/features/service-requests';

import { createServerSideProps } from '@/server/utils/server-side';

import { type AppPageProps } from './_app';

const HomePage: AppPageProps['Component'] = () => {
  return (
    <>
      {/* Hero section */}
      <HeroSection />

      {/* Services request section */}
      <ServiceRequestsSection />

      {/* Features section */}
      <FeaturesSection />

      {/* Testimonial section */}
      <TestimonialSection />
    </>
  );
};

export const getServerSideProps = createServerSideProps({
  shouldUseSSG: true,
  resolver: async ({ ctx, ssg }) => {
    await ssg?.services.getAllServiceRequests.prefetch({
      limit: DEFAULT_SERVICE_REQUESTS_LIMIT,
    });
    return { props: {} };
  },
});

export default HomePage;
