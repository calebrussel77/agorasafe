/* eslint-disable @next/next/no-img-element */
import { WizardLayout } from '@/layouts';

import { Seo } from '@/components/ui/seo';

import { DateForm, publishServiceSteps } from '@/features/services';

import { type AppPageProps } from '@/pages/_app';

const meta = {
  title: 'Publier un nouveau service - Durée du service',
  description: `Remplissez simplement notre formulaire de création de service afin de vous faire aider par un professionel.`,
};

const DateStepPage: AppPageProps['Component'] = () => {
  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      <DateForm error={null} isLoading={false} />
    </>
  );
};

DateStepPage.getLayout = page => (
  <WizardLayout currentStep={3} steps={publishServiceSteps}>
    {page}
  </WizardLayout>
);

export default DateStepPage;
