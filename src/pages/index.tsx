import {
  FeaturesSection,
  HeroSection,
  TestimonialSection,
} from '@/features/home-page';
import {
  DEFAULT_SERVICE_REQUESTS_LIMIT,
  LatestServiceRequests,
} from '@/features/service-requests';

import { createServerSideProps } from '@/server/utils/server-side';

import { type AppPageProps } from './_app';

const HomePage: AppPageProps['Component'] = () => {
  return (
    <>
      {/* Hero section */}
      <HeroSection />

      {/* Latest Service requests section */}
      <LatestServiceRequests />

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
