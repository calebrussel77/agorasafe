import { WizardLayout } from '@/layouts';

import { Seo } from '@/components/ui/seo';

import {
  AddressForm,
  publishServiceSteps,
} from '@/features/publish-service-request';

import { type AppPageProps } from '@/pages/_app';

const meta = {
  title: 'Publier un nouveau service - Durée du service',
  description: `Remplissez simplement notre formulaire de création de service afin de vous faire aider par un professionel.`,
};

const AddressStepPage: AppPageProps['Component'] = () => {
  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      <AddressForm error={null} isLoading={false} />
    </>
  );
};

AddressStepPage.getLayout = page => (
  <WizardLayout currentStep={5} steps={publishServiceSteps}>
    {page}
  </WizardLayout>
);

export default AddressStepPage;
