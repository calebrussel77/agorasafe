import { useState } from 'react';

import { AgorasafeMap } from '@/components/agorasafe-map';
import { Button } from '@/components/ui/button';
import { CenterContent } from '@/components/ui/layout';
import { type ContextModalProps, modals } from '@/components/ui/modal';
import { Seo } from '@/components/ui/seo';
import { Typography } from '@/components/ui/typography';

const meta = {
  title: 'Page des tests',
  description: `Renseignez les informations ci-dessous pour facilement gérer vos
  projets, consulter vos candidatures, rechercher des prestataires
  ou des demandes de service, etc.`,
};

const YourComponent = () => {
  const openDialog = () => {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: (
        <Typography>
          This action is so important that you are required to confirm it with a
          modal. Please click one of these buttons to proceed.
        </Typography>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => console.log('Confirmed'),
    });
  };

  return (
    <div>
      <Button onClick={openDialog}>Open Dialog</Button>
    </div>
  );
};

export const TestModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ modalBody: string }>) => (
  <>
    <Typography>{innerProps.modalBody}</Typography>
    <Button className="mt-6" onClick={() => context.closeModal(id)}>
      Close modal
    </Button>
  </>
);

const TestPage = () => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      <AgorasafeMap />
      {/* <CenterContent>
        The test page bro
        <YourComponent />
     
      </CenterContent> */}
    </>
  );
};

TestPage.getLayout = (page: React.ReactNode) => {
  return page;
};

export default TestPage;
