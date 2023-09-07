import { WizardLayout } from '@/layouts';

import { Seo } from '@/components/ui/seo';

import { PhoneForm, publishServiceSteps } from '@/features/services';

import { type AppPageProps } from '@/pages/_app';

const meta = {
  title: 'Publier un nouveau service - Durée du service',
  description: `Remplissez simplement notre formulaire de création de service afin de vous faire aider par un professionel.`,
};

const PhoneStepPage: AppPageProps['Component'] = () => {
  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      <PhoneForm error={null} isLoading={false} />
    </>
  );
};

PhoneStepPage.getLayout = page => (
  <WizardLayout currentStep={6} steps={publishServiceSteps}>
    {page}
  </WizardLayout>
);

export default PhoneStepPage;
