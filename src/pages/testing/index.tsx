import { Welcome2Icon } from '@/components/icons/welcome2-icon';
import { WelcomeIcon } from '@/components/icons/welcome-icon';
import { Button } from '@/components/ui/button';
import { modals } from '@/components/ui/modal';
import { Editor } from '@/components/ui/rich-text-editor';
import { Seo } from '@/components/ui/seo';
import { Typography } from '@/components/ui/typography';

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
        <button
          onClick={() =>
            modals.open({
              children: (
                <div className="flex flex-col justify-center p-10">
                  <Welcome2Icon className="h-36 w-auto" />
                  <div className="mt-6 flex flex-col items-center justify-center text-center">
                    <Typography variant="h2">
                      Profil ajouté avec succès !🎉🥳
                    </Typography>
                    <Typography variant="subtle" className="mt-2">
                      Le profil Elat cale à été crée avec succès. Profitez d'une
                      expérence unique en basculant facilement entre vos
                      différents profils ajoutés.
                    </Typography>
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <Button
                        onClick={() => modals.closeAll()}
                        className="w-auto"
                        variant="ghost"
                      >
                        Ok, j'ai compris
                      </Button>
                      <Button className="w-auto">Utiliser ce profil</Button>
                    </div>
                  </div>
                </div>
              ),
            })
          }
        >
          Salut click
        </button>
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
