import { Editor } from '@/components/ui/rich-text-editor';
import { Seo } from '@/components/ui/seo';

const meta = {
  title: 'Page des tests',
  description: `Renseignez les informations ci-dessous pour facilement gérer vos
  projets, consulter vos candidatures, rechercher des prestataires
  ou des demandes de service, etc.`,
};

const TestPage = () => {
  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      {/* <AgorasafeMap /> */}
      <div className="relative mx-auto my-24 w-full max-w-screen-lg">
        <Editor
          includeControls={[
            'colors',
            'commands',
            'formatting',
            'list',
            'task-list',
            'media',
          ]}
        />
      </div>
    </>
  );
};

TestPage.getLayout = (page: React.ReactNode) => {
  return page;
};

export default TestPage;
