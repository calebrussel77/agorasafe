import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { Anchor } from '@/components/anchor';
import { GoogleSolidIcon } from '@/components/icons/google-solid-icon';
import { LogoSymbolIcon } from '@/components/icons/logo-icon';
import { Button, buttonVariants } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { SectionMessage } from '@/components/ui/section-message';
import { SignInError } from '@/components/ui/sign-error';

import { useAuth } from '@/features/auth';

import { handleRouteBack } from '@/utils/routing';

import { cn } from '@/lib/utils';

import { createServerSideProps } from '@/server/utils/server-side';

import { useRedirectUrl } from '@/hooks/use-redirect-url';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const error = router.query?.error as string | undefined;

  const { redirectUrl, redirectReason } = useRedirectUrl();
  const { onGooleSignIn } = useAuth();

  const onRegisterWithGoogle = async () => {
    setIsLoading(true);
    await onGooleSignIn({
      redirectUrl,
      onSeatled() {
        setTimeout(() => setIsLoading(false), 4000);
      },
    });
  };

  return (
    <>
      {!!redirectReason && (
        <SectionMessage
          className="mb-0 rounded-none"
          title={redirectReason}
          appareance="warning"
          isSticky
        />
      )}
      {!!error && <SignInError className="mb-0 rounded-none" error={error} />}
      <div className="container relative grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <button
          onClick={() => handleRouteBack({ router })}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )}
        >
          <MoveLeft className="h-5 w-5" />
          <span>Retour</span>
        </button>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 z-10 bg-gray-900/40" />
          <Image
            src="/images/login-image.png"
            alt="Femme qui tresse une tête"
            className="absolute inset-0 h-full w-full"
          />
          <div className="relative z-20">
            <LogoSymbolIcon className="h-8 w-auto" />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Grâce à Agorasafe j'ai pu facilement publier mon besoin
                et choisir un prestataire qualifié tout près de chez moi pour
                résoudre mon problème.&rdquo;
              </p>
              <footer className="text-sm">Jeanne N.</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Se connecter ou s’inscrire en quelques secondes
              </h1>
              <p className="text-sm text-muted-foreground">
                Connectez-vous et faites partie de notre aventure passionnante
                sur Agorasafe (c’est gratuit)
              </p>
            </div>
            <Button
              isLoading={isLoading}
              onClick={() => void onRegisterWithGoogle()}
              className="mt-6 flex w-full items-center justify-center font-semibold"
            >
              <GoogleSolidIcon className="h-5 w-5" />
              <span>Continuer avec Google</span>
            </Button>
            <p className="px-8 text-center text-sm text-muted-foreground">
              En continuant, vous acceptez nos{' '}
              <Anchor
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                conditions générales d’utilisation
              </Anchor>{' '}
              et{' '}
              <Anchor
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                politique de confidentialité
              </Anchor>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = createServerSideProps({
  shouldUseSession: true,
  resolver: ({ session }) => {
    if (session) {
      // redirect to choosing profile type selection page if user has'nt been onboarded
      if (!session.user.hasBeenOnboarded) {
        return {
          redirect: {
            destination: '/onboarding/choose-profile-type',
            permanent: false,
          },
        };
      }
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  },
});

LoginPage.getLayout = (page: React.ReactElement) => page;

export default LoginPage;
