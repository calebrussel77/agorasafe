import Image from 'next/future/image';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

import { gaTrackEvent } from '@/utils/ga-events';

import callToActionBg from '../images/background-call-to-action.jpg';

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-brand-700 py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={callToActionBg}
        alt=""
        fill={false}
        width={2347}
        height={1244}
      />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl tracking-tight text-white sm:text-4xl">
            Commencer maintenant
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Rencontrez des prestataires de confiance ou partagez vos talents.
            Notre plateforme rapproche les besoins et les compétences pour un
            succès mutuel. Rejoignez-nous dès aujourd'hui et connectez-vous à
            une nouvelle expérience de services en ligne
          </p>
          <Button
            onClick={() =>
              gaTrackEvent('cta-click', {
                category: 'CTA',
                message: 'Homepage - Start now CTA',
              })
            }
            href="/auth/login"
            variant="secondary"
            className="mt-10"
          >
            Commencer
          </Button>
        </div>
      </Container>
    </section>
  );
}
