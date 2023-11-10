import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { Anchor } from '@/components/anchor';
import { GoogleSolidIcon } from '@/components/icons/google-solid-icon';
import { LogoSymbolIcon } from '@/components/icons/logo-icon';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { SectionMessage } from '@/components/ui/section-message';
import { SignInError } from '@/components/ui/sign-error';

import {
  type LoginRedirectReason,
  loginRedirectReasons,
  useAuth,
} from '@/features/auth';

import { handleRouteBack } from '@/utils/routing';

import { cn } from '@/lib/utils';

import { createServerSideProps } from '@/server/utils/server-side';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    error,
    redirectUrl = '/',
    reason,
  } = router.query as {
    error: string;
    redirectUrl: string;
    reason: LoginRedirectReason;
  };

  const redirectReason = loginRedirectReasons[reason];

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
      <div className="fixed bottom-0 left-0 top-0 hidden h-full w-1/2 flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 z-10 bg-gray-900/40" />
        <Image
          src="/images/login-image.png"
          alt="Femme qui tresse une tête"
          className="absolute inset-0 h-full w-full"
        />
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Grâce à Agorasafe j'ai pu facilement publier mon besoin et
              choisir un prestataire qualifié tout près de chez moi pour
              résoudre mon problème.&rdquo;
            </p>
            <footer className="text-sm">Jeanne N.</footer>
          </blockquote>
        </div>
      </div>
      <div className="ml-auto flex h-screen w-1/2 flex-col">
        {!!error && <SignInError className="mb-0 rounded-none" error={error} />}
        {!!redirectReason && (
          <SectionMessage
            className="mb-0 rounded-none"
            title={redirectReason}
            appareance="warning"
            isSticky
          />
        )}
        <div className="flex h-full flex-1 flex-col p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleRouteBack({ router })}
              className={cn(buttonVariants({ variant: 'ghost' }))}
            >
              <MoveLeft className="h-5 w-5" />
              <span>Retour</span>
            </button>
            <Anchor href="/" className="ml-1 flex items-center gap-x-1.5">
              <LogoSymbolIcon className="h-7 w-auto md:h-8" />
              <Badge
                content="Alpha"
                size="sm"
                variant="warning"
                shape="rounded"
                title="Ce projet est encore en cours de developpement."
              />
            </Anchor>
          </div>
          <div className="mx-auto flex h-full w-full flex-1 flex-col items-center justify-center space-y-6 sm:w-[450px]">
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
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }
  },
});

LoginPage.getLayout = (page: React.ReactElement) => page;

export default LoginPage;
