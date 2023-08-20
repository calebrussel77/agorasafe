import React, { type FC, type ReactElement } from 'react';

import { AutoAnimate } from '@/components/ui/auto-animate';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SectionMessage } from '@/components/ui/section-message';

import { useOnboardingSubscriber } from '../services';
import { FormSubscription } from './form-subscription';

interface FormSubscriptionModalProps {
  className?: string;
  children?: ReactElement;
}

const FORM_SUBSCRIPTION_ID = 'onboarding_subsciption';

const FormSubscriptionModal: FC<FormSubscriptionModalProps> = ({
  children,
}) => {
  const { onSubscribe, isLoading, isSuccess } = useOnboardingSubscriber();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <AutoAnimate>
          <DialogHeader>
            <DialogTitle>S'inscrire pour le lancement d'Agorasafe</DialogTitle>
            <DialogDescription>
              Nous sommes en cours de développement. Inscrivez-vous pour
              découvrir nos nouveautés en exclusivité.
            </DialogDescription>
          </DialogHeader>
          {isSuccess ? (
            <SectionMessage
              title="Inscription réussie"
              description={
                <p className="text-sm md:text-base">
                  Un email de confirmation a été envoyé à votre adresse email
                  (Consultez vos <b>spams</b> si vous ne le voyez pas) suite à
                  votre souscription. Nous vous remercions !
                </p>
              }
              hasCloseButton={false}
              appareance="success"
            />
          ) : (
            <div className="p-6">
              <FormSubscription
                formId={FORM_SUBSCRIPTION_ID}
                onSubmit={onSubscribe}
              />
            </div>
          )}
          {!isSuccess && (
            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading}
                form={FORM_SUBSCRIPTION_ID}
              >
                {isLoading ? 'Chargement...' : "M'inscrire"}
              </Button>
            </DialogFooter>
          )}
        </AutoAnimate>
      </DialogContent>
    </Dialog>
  );
};

export { FormSubscriptionModal };
