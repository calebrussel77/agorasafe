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
  FeaturedProviders,
  LATEST_SERVICE_REQUESTS_COUNT,
  LatestServiceRequests,
} from '@/features/service-requests';

import { createServerSideProps } from '@/server/utils/server-side';

import { type AppPageProps } from './_app';

const HomePage: AppPageProps['Component'] = () => {
  return (
    <>
      <Hero />
      <PrimaryFeatures type="customer" />
      <LatestServiceRequests />
      <PrimaryFeatures type="provider" />
      <FeaturedProviders />
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
      await ssg?.profiles.getProfiles.prefetch({
        profileType: 'PROVIDER',
      });
    }
    return { props: {} };
  },
});

export default HomePage;
