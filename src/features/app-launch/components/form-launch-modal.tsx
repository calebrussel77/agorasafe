import React, { type FC, type ReactElement } from 'react';

import { AutoAnimate } from '@/components/ui/auto-animate';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { SectionMessage } from '@/components/ui/section-message';

import { useOnboardingSubscriber } from '../services';
import { FormLaunch } from './form-launch';

interface FormLaunchModalProps {
  className?: string;
  children?: ReactElement;
}

const FORM_SUBSCRIPTION_ID = 'onboarding_subsciption';

const FormLaunchModal: FC<FormLaunchModalProps> = ({ children }) => {
  const { onSubscribe, isLoading, isSuccess } = useOnboardingSubscriber();

  return (
    <Modal
      classNames={{ root: 'sm:max-w-[650px]' }}
      trigger={children}
      triggerProps={{ asChild: true }}
      name="🚀 Soyez parmi les premiers à découvrir notre plateforme !"
      description="Inscrivez votre adresse e-mail ou numéro whatsapp pour bénéficier d'un accès anticipé, de notifications en temps réel et de la possibilité d'influencer le développement de la plateforme."
      footer={
        !isSuccess && (
          <>
            <Button type="button" disabled={isLoading} variant="ghost">
              Annuler
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              form={FORM_SUBSCRIPTION_ID}
            >
              Inscription
            </Button>
          </>
        )
      }
    >
      <AutoAnimate>
        {isSuccess ? (
          <SectionMessage
            title="Inscription réussie"
            description="Un email de confirmation a été envoyé à votre adresse email
            (Consultez vos spams si vous ne le voyez pas) suite à
            votre souscription. Nous vous remercions !"
            hasCloseButton={false}
            appareance="success"
          />
        ) : (
          <div className="px-6">
            <FormLaunch formId={FORM_SUBSCRIPTION_ID} onSubmit={onSubscribe} />
          </div>
        )}
      </AutoAnimate>
    </Modal>
  );
};

export { FormLaunchModal };
