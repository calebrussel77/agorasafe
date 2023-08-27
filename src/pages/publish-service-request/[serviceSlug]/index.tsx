/* eslint-disable @next/next/no-img-element */
import { WizardLayout } from '@/layouts';

// import { useRouter } from 'next/router';
import { Seo } from '@/components/ui/seo';

import {
  BasicInfoForm,
  publishServiceSteps,
} from '@/features/publish-service-request';

import { type AppPageProps } from '@/pages/_app';

const meta = {
  title: 'Publier un nouveau service - Informations principales',
  description: `Remplissez simplement notre formulaire de création de service afin de vous faire aider par un professionel.`,
};

const PublishNewServicePage: AppPageProps['Component'] = () => {
  
  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      <BasicInfoForm error={null} isLoading={false} />
    </>
  );
};

PublishNewServicePage.getLayout = page => (
  <WizardLayout currentStep={1} steps={publishServiceSteps}>
    {page}
  </WizardLayout>
);

export default PublishNewServicePage;
