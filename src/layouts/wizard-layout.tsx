import React, { type FC, type ReactNode } from 'react';

import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { CenterContent } from '@/components/ui/layout';
import { Typography } from '@/components/ui/typography';

type StepItem = {
  title?: string;
  description?: string;
};

interface WizardLayoutProps {
  currentStep: number;
  steps: StepItem[];
  children?: ReactNode;
}

const WizardLayout: FC<WizardLayoutProps> = ({
  children,
  currentStep,
  steps,
}) => {
  return (
    <>
      <div className="flex h-full min-h-screen w-full flex-1 flex-col">
        <Header />
        <CenterContent className="min-w-xl container w-full max-w-2xl">
          <div>
            <Typography as="h1" variant="h4" className="pb-6 text-brand-600">
              Étape {currentStep} / {steps?.length}
            </Typography>
            <Card>
              <Card.Header>
                <Card.Title>{steps[currentStep - 1]?.title}</Card.Title>
                <Card.Description>
                  {steps[currentStep]?.description}
                </Card.Description>
              </Card.Header>
              <Card.Content>{children}</Card.Content>
            </Card>
          </div>
        </CenterContent>
      </div>
    </>
  );
};

const getLayout = (page: React.ReactElement<WizardLayoutProps & unknown>) => {
  return <WizardLayout {...page.props}>{page}</WizardLayout>;
};

export { WizardLayout, getLayout as getWizardLayout };
