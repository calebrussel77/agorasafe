import { Boxes, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { type FC } from 'react';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import { FormSubscriptionModal } from '@/features/app-subscription';

const features = [
  {
    name: 'Accès à une large base de talents amateurs qualifiés.',
    description: `Découvrez une communauté florissante de talents amateurs qualifiés au Cameroun. Trouvez le talent parfait pour votre projet, quel que soit votre domaine.`,
    icon: Boxes,
  },
  // {
  //   name: 'Transparence des prix et des compétences.',
  //   description: `Obtenez une transparence totale des prix et des compétences des prestataires. Faites des choix éclairés grâce à des informations détaillées et des évaluations de clients.`,
  //   icon: CalendarDays,
  // },
  // {
  //   name: 'Facilité de mise en relation et de gestion des projets.',
  //   description:
  //     'Mettez-vous en relation facilement avec les prestataires et gérez vos projets sans tracas. Simplifiez votre processus de collaboration et réalisez vos projets en toute fluidité.',
  //   icon: Boxes,
  // },
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
  // {
  //   name: 'Priorisation des résultats de recherche autour de votre zone de localisation',
  //   description: `Trouvez des prestataires proches de vous grâce à notre priorisation basée sur la localisation. Profitez de la commodité de travailler avec des talents locaux qui comprennent vos besoins spécifiques.`,
  //   icon: Boxes,
  // },
];

interface FeaturesSectionProps {
  className?: string;
}

const FeaturesSection: FC<FeaturesSectionProps> = ({}) => {
  return (
    <div className="mt-24">
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-15rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[50deg] bg-gradient-to-tr from-[#ff80b5] to-brand-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-screen-xl md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
            <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
                <Typography
                  as="h2"
                  className="text-base font-semibold leading-7 text-brand-600"
                >
                  Tout ce dont vous avez besoin
                </Typography>
                <Typography
                  variant="h2"
                  className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                >
                  Proposez mes services ou demandez un service ? Pas de
                  problème.
                </Typography>
                <Typography
                  variant="subtle"
                  className="mt-3 text-lg leading-8 text-gray-600"
                >
                  Les prestataires de services amateurs peuvent mettre en valeur
                  leurs compétences et talents, tandis que les clients peuvent
                  trouver des services abordables pour répondre à leurs besoins.
                </Typography>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
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
              </div>
            </div>
            <div className="sm:px-6 lg:px-0">
              <div className="relative isolate overflow-hidden bg-brand-500 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
                <div
                  className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-20deg] bg-brand-100 opacity-20 ring-1 ring-inset ring-white"
                  aria-hidden="true"
                />
                <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                  <Image
                    src="/images/femme-menage.jpg"
                    alt="product preview"
                    width={1364}
                    height={866}
                    quality={100}
                    className="-mb-10 w-[58rem] max-w-none rounded-tl-xl bg-gray-800 ring-1 ring-white/10"
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-brand-500 opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  );
};

export { FeaturesSection };
