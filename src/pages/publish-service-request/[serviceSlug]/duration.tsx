/* eslint-disable @next/next/no-img-element */
import { WizardLayout } from '@/layouts';

import { Seo } from '@/components/ui/seo';

import {
  NumberHoursForm,
  publishServiceSteps,
} from '@/features/publish-service-request';

import { type AppPageProps } from '@/pages/_app';

const meta = {
  title: 'Publier un nouveau service - Durée du service',
  description: `Remplissez simplement notre formulaire de création de service afin de vous faire aider par un professionel.`,
};

const DurationStepPage: AppPageProps['Component'] = () => {
  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      <NumberHoursForm error={null} isLoading={false} />
    </>
  );
};

DurationStepPage.getLayout = page => (
  <WizardLayout currentStep={2} steps={publishServiceSteps}>
    {page}
  </WizardLayout>
);

export default DurationStepPage;
