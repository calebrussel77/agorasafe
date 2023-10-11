import { CenterContent } from '@/components/ui/layout';
import { Seo } from '@/components/ui/seo';

const meta = {
  title: 'Page des tests',
  description: `Renseignez les informations ci-dessous pour facilement gérer vos
  projets, consulter vos candidatures, rechercher des prestataires
  ou des demandes de service, etc.`,
};

const FormsTestPage = () => {
  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      <CenterContent className="container min-h-screen w-full max-w-2xl">
        The test page bro
      </CenterContent>
    </>
  );
};

export default FormsTestPage;
