import React, { type FC } from 'react';

import { Container } from '@/components/ui/container';
import { Image } from '@/components/ui/image';
import { Typography } from '@/components/ui/typography';

interface ServiceRequestsHeroProps {
  className?: string;
}

const ServiceRequestsHero: FC<ServiceRequestsHeroProps> = ({}) => {
  return (
    <section
      aria-labelledby="service-requests-title"
      className="relative overflow-hidden bg-slate-50 py-16"
    >
      <Image
        hasOverLay
        className="absolute inset-0"
        src="/images/coiffure-femme.jpg"
        alt="Femmes menage"
      />
      <Container className="relative z-20 pb-16 text-center">
        <Typography as="h1" className="mx-auto max-w-4xl text-white">
          Toutes nos demandes de service
        </Typography>
      </Container>
    </section>
  );
};

export { ServiceRequestsHero };
