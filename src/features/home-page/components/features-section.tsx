import { Boxes, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import React, { type FC } from 'react';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import { FormSubscriptionModal } from '@/features/onboarding-souscription/components/form-subscription-modal';
import { useOnboardingSubscriber } from '@/features/onboarding-souscription/services';

const features = [
  {
    name: 'Accès à une large base de talents amateurs qualifiés.',
    description: `Découvrez une communauté florissante de talents amateurs qualifiés au Cameroun. Trouvez le talent parfait pour votre projet, quel que soit votre domaine.`,
    icon: Boxes,
  },
  {
    name: 'Transparence des prix et des compétences.',
    description: `Obtenez une transparence totale des prix et des compétences des prestataires. Faites des choix éclairés grâce à des informations détaillées et des évaluations de clients.`,
    icon: CalendarDays,
  },
  {
    name: 'Facilité de mise en relation et de gestion des projets.',
    description:
      'Mettez-vous en relation facilement avec les prestataires et gérez vos projets sans tracas. Simplifiez votre processus de collaboration et réalisez vos projets en toute fluidité.',
    icon: Boxes,
  },
  {
    name: 'Coûts abordables pour les services de haute qualité.',
    description:
      'Des services de haute qualité à des prix abordables. Trouvez les prestataires amateurs les plus talentueux au Cameroun sans vous ruiner.',
    icon: CalendarDays,
  },
  {
    name: 'Visibilité accrue pour les prestataires.',
    description: `Nous offrons une visibilité accrue pour les prestataires sur notre plateforme. Nous travaillons dur pour que les prestataires soient facilement trouvables et visibles pour les clients.`,
    icon: Boxes,
  },
  {
    name: 'Priorisation des résultats de recherche autour de votre zone de localisation',
    description: `Trouvez des prestataires proches de vous grâce à notre priorisation basée sur la localisation. Profitez de la commodité de travailler avec des talents locaux qui comprennent vos besoins spécifiques.`,
    icon: Boxes,
  },
];

interface FeaturesSectionProps {
  className?: string;
}

const FeaturesSection: FC<FeaturesSectionProps> = ({}) => {
  const { onSubscribe, isLoading, isSuccess } = useOnboardingSubscriber();

  return (
    <div className="mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <Typography
            as="h2"
            className="text-base font-semibold leading-7 text-brand-600"
          >
            Tout ce dont vous avez besoin
          </Typography>
          <Typography variant="h2" className="mt-2 text-3xl">
            Manque d'accès aux clients ou à des services abordables ? Pas de
            problème.
          </Typography>
          <Typography variant="subtle" className="mt-6">
            Sur Agorasafe, les prestataires de services amateurs peuvent mettre
            en valeur leurs compétences et talents, tandis que les clients
            peuvent trouver des services abordables pour répondre à leurs
            besoins.
          </Typography>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Image
            src="/images/femme-charpentière.jpg"
            alt="jeune fille charpentière"
            className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            fill={false}
            width={2432}
            height={1442}
          />
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map(feature => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <feature.icon
                  className="absolute left-1 top-1 h-5 w-5 text-brand-600"
                  aria-hidden="true"
                />
                {feature.name}
              </dt>{' '}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
        <FormSubscriptionModal>
          <Button className="mx-auto mt-10 flex justify-center">
            Inscrivez-vous dès maintenant
          </Button>
        </FormSubscriptionModal>
      </div>
    </div>
  );
};

export { FeaturesSection };
