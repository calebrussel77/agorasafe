/* eslint-disable @next/next/no-img-element */
import { WizardLayout } from '@/layouts';
import { useRouter } from 'next/router';

import { Redirect } from '@/components/redirect';
import { Seo } from '@/components/ui/seo';

import { StepOneForm } from '@/features/publish-service';

import { type AppPageProps } from '@/contexts/app-context';

const meta = {
  title: 'Publier un nouveau service',
  description: `Remplissez simplement notre formulaire de création de service afin de vous faire aider par un professionel.`,
};

const PublishNewServicePage: AppPageProps['Component'] = () => {
  const router = useRouter();
  const serviceItemQuery = router.query.service_item as string;

  if (!serviceItemQuery && router.isReady) return <Redirect to="/" />;

  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      <StepOneForm error={null} isLoading={false} />
    </>
  );
};

PublishNewServicePage.hasProfileSession = true;
PublishNewServicePage.getLayout = page => (
  <WizardLayout currentStep={1} steps={5}>
    {page}
  </WizardLayout>
);

export default PublishNewServicePage;
