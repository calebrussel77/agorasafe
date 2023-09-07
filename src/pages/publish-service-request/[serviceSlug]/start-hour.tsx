/* eslint-disable @next/next/no-img-element */
import { WizardLayout } from '@/layouts';

import { Seo } from '@/components/ui/seo';

import { StartHourForm, publishServiceSteps } from '@/features/services';

import { type AppPageProps } from '@/pages/_app';

const meta = {
  title: 'Publier un nouveau service - Durée du service',
  description: `Remplissez simplement notre formulaire de création de service afin de vous faire aider par un professionel.`,
};

const StartHourStepPage: AppPageProps['Component'] = () => {
  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      <StartHourForm error={null} isLoading={false} />
    </>
  );
};

StartHourStepPage.getLayout = page => (
  <WizardLayout currentStep={4} steps={publishServiceSteps}>
    {page}
  </WizardLayout>
);

export default StartHourStepPage;
