import React, { type FC, type ReactNode } from 'react';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CenterContent } from '@/components/ui/layout';
import { Typography } from '@/components/ui/typography';

interface WizardLayoutProps {
  currentStep: number;
  steps: number;
  children?: ReactNode;
}
const stepList = [
  {
    title: 'Quel est votre besoin ?',
    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. At est
  modi aliquam rem quos cumque velit! Consequatur placeat, itaque,
  quod repudiandae deleniti ut eligendi minus fuga ratione, magni
  libero fugiat.`,
  },
  {
    title: 'Combien de temps il faudra pour effectuer la tâche ?',
    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. At est
  modi aliquam rem quos cumque velit! Consequatur placeat, itaque,
  quod repudiandae deleniti ut eligendi minus fuga ratione, magni
  libero fugiat.`,
  },
] as const;

const WizardLayout: FC<WizardLayoutProps> = ({
  children,
  currentStep,
  steps,
}) => {
  return (
    <>
      <div className="flex h-full min-h-screen w-full flex-1 flex-col">
        <Header />
        <CenterContent className="container w-full max-w-2xl">
          <div>
            <Typography as="h1" variant="h4" className="pb-6 text-brand-600">
              Étape {currentStep} / {steps}
            </Typography>
            <Card>
              <Card.Header>
                <Card.Title>{stepList[currentStep - 1]?.title}</Card.Title>
                <Card.Description>
                  {stepList[currentStep]?.description}
                </Card.Description>
              </Card.Header>
              <Card.Content>{children}</Card.Content>
            </Card>
          </div>
        </CenterContent>
        <footer className="sticky bottom-0 z-10 mt-16 w-full border-t border-gray-200 bg-white px-6 py-3 shadow-md">
          <div className="flex items-center justify-end gap-6">
            {currentStep > 1 && (
              <Button variant="ghost" size="lg">
                Retour
              </Button>
            )}
            <Button size="lg">Suivant</Button>
          </div>
        </footer>
      </div>
    </>
  );
};

const getLayout = (page: React.ReactElement<WizardLayoutProps & unknown>) => {
  return <WizardLayout {...page.props}>{page}</WizardLayout>;
};

export { WizardLayout, getLayout as getWizardLayout };
