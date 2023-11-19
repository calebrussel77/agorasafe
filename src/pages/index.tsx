import {
  CallToAction,
  Faqs,
  Hero,
  Pricing,
  PrimaryFeatures,
  SecondaryFeatures,
  Testimonials,
} from '@/features/app-launch';
import {
  LATEST_SERVICE_REQUESTS_COUNT,
  LatestServiceRequests,
} from '@/features/service-requests';

import { createServerSideProps } from '@/server/utils/server-side';

import { type AppPageProps } from './_app';

const HomePage: AppPageProps['Component'] = () => {
  return (
    <>
      <Hero />
      <LatestServiceRequests />
      <PrimaryFeatures />
      <SecondaryFeatures />
      <CallToAction />
      <Testimonials />
      <Pricing />
      <Faqs />
    </>
  );
};

export const getServerSideProps = createServerSideProps({
  shouldUseSSG: true,
  resolver: async ({ ctx, ssg }) => {
    if (ssg) {
      await ssg?.serviceRequests.getAll.prefetch({
        limit: LATEST_SERVICE_REQUESTS_COUNT,
      });
    }
    return { props: {} };
  },
});

export default HomePage;
