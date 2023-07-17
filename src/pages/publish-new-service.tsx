/* eslint-disable @next/next/no-img-element */
import { withProfile } from '@/hoc/with-profile';
import { MainLayout } from '@/layouts';
import { useRouter } from 'next/router';

import { Redirect } from '@/components/redirect';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CenterContent } from '@/components/ui/layout';
import { Typography } from '@/components/ui/typography';

import {
  PUBLISH_SERVICE_STEP_ONE_FORM_ID,
  StepOneForm,
} from '@/features/publish-service';

const PublishNewService = () => {
  const router = useRouter();
  const serviceItemQuery = router.query.service_item as string;

  if (!serviceItemQuery && router.isReady) return <Redirect to="/" />;

  return (
    <MainLayout
      footer={
        <footer className="sticky bottom-0 z-10 mt-16 w-full border-t border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center justify-end gap-6">
            <Button variant="ghost" size="lg">
              Retour
            </Button>
            <Button size="lg" form={PUBLISH_SERVICE_STEP_ONE_FORM_ID}>
              Suivant
            </Button>
          </div>
        </footer>
      }
    >
      <CenterContent className="p-3">
        <div className="container max-w-2xl">
          <Typography as="h1" variant="h5" className="pb-6 text-brand-600">
            Étape 1 / 5
          </Typography>
          <Card>
            <Card.Header>
              <Card.Title>Quel est votre besoin ?</Card.Title>
              <Card.Description>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. At est
                modi aliquam rem quos cumque velit! Consequatur placeat, itaque,
                quod repudiandae deleniti ut eligendi minus fuga ratione, magni
                libero fugiat.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <StepOneForm error={null} isLoading={false} />
            </Card.Content>
          </Card>
        </div>
      </CenterContent>
    </MainLayout>
  );
};

export default withProfile(PublishNewService);
