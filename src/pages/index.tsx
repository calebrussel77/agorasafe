import {
  FeaturesSection,
  HeroSection,
  TestimonialSection,
} from '@/features/home-page';
import {
  LatestServiceRequests,
} from '@/features/service-requests';

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

// export const getServerSideProps = createServerSideProps({
//   shouldUseSSG: true,
//   resolver: async ({ ctx, ssg }) => {
//     await ssg?.services.getAllServiceRequests.prefetch({
//       limit: LATEST_SERVICE_REQUESTS_COUNT,
//     });
//     return { props: {} };
//   },
// });

export default HomePage;
