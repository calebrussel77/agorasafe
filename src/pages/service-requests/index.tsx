import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';

import {
  LATEST_SERVICE_REQUESTS_COUNT,
  ServiceRequestsHero,
} from '@/features/service-requests';

import { createServerSideProps } from '@/server/utils/server-side';

import { type AppPageProps } from '../_app';

const ServiceRequestsPage: AppPageProps['Component'] = () => {
  return (
    <>
      <ServiceRequestsHero />
      <Container className="mt-6">
        <div>
          <Input />
        </div>
      </Container>
      {/* <LatestServiceRequests /> */}
    </>
  );
};

export const getServerSideProps = createServerSideProps({
  shouldUseSSG: true,
  resolver: async ({ ctx, ssg }) => {
    if (ssg) {
      await ssg?.services.getAllServiceRequests.prefetch({
        limit: LATEST_SERVICE_REQUESTS_COUNT,
      });
    }
    return { props: {} };
  },
});

export default ServiceRequestsPage;
