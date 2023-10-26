import {
  AlignEndVertical,
  BookTemplate,
  ChefHat,
  Globe2,
  Scale3d,
} from 'lucide-react';
import Image from 'next/future/image';

import backgroundImage from '../images/background-faqs.jpg';

const customerFeatures = [
  {
    id: 1,
    name: 'Trouvez le Talent Parfait',
    description:
      'Trouvez des prestataires locaux pour répondre à vos besoins, que ce soit pour une réparation, un service, ou un projet créatif.',
    icon: Globe2,
  },
  {
    id: 2,
    name: 'Demandes Faciles et Rapides',
    description:
      'Créez des demandes de service en quelques clics, spécifiant vos besoins et votre budget, puis recevez des offres personnalisées.',
    icon: Scale3d,
  },
  {
    id: 3,
    name: 'Évaluations et Recommandations',
    description:
      'Consultez les évaluations et recommandations des autres clients pour choisir en toute confiance le prestataire adapté à votre projet.',
    icon: BookTemplate,
  },
  {
    id: 4,
    name: 'Paiements Sécurisés',
    description:
      'Effectuez des paiements en ligne sécurisés pour les services, avec une protection intégrée pour garantir votre satisfaction.',
    icon: BookTemplate,
  },
  {
    id: 5,
    name: 'Communication Simplifiée',
    description:
      'Communiquez facilement avec les prestataires, partagez des fichiers, fixez des rendez-vous et suivez la progression de votre projet, le tout sur la plateforme.',
    icon: BookTemplate,
  },
];

const providerFeatures = [
  {
    id: 1,
    name: 'Créez un Profil Professionnel',
    description:
      'Affichez vos compétences, votre expérience et vos tarifs pour attirer les clients intéressés par vos services.',
    icon: ChefHat,
  },
  {
    id: 2,
    name: 'Répondez aux Demandes',
    description:
      'Recevez des notifications instantanées pour les nouvelles demandes de service correspondant à vos compétences, puis soumettez vos offres.',
    icon: AlignEndVertical,
  },
  {
    id: 3,
    name: 'Gestion Simplifiée',
    description:
      'Gérez votre emploi du temps, vos rendez-vous, et vos revenus grâce à des outils de gestion intégrés.',
    icon: AlignEndVertical,
  },
  {
    id: 4,
    name: 'Exposition Maximale',
    description:
      'Augmentez votre visibilité grâce à un classement prioritaire dans les résultats de recherche locaux.',
    icon: AlignEndVertical,
  },
  {
    id: 5,
    name: 'Avis Clients Positifs',
    description:
      'Recevez des évaluations positives et des commentaires de clients satisfaits pour renforcer votre réputation et gagner de nouveaux clients.',
    icon: AlignEndVertical,
  },
];

export function PrimaryFeatures() {
  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-gray-50 py-16 lg:py-24"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        src={backgroundImage}
        alt=""
        width={2245}
        height={1636}
        unoptimized
      />
      <div className="relative mx-auto max-w-xl px-6 lg:max-w-7xl lg:px-8">
        <svg
          className="absolute left-full hidden -translate-x-1/2 -translate-y-1/4 transform lg:block"
          width={404}
          height={784}
          fill="none"
          viewBox="0 0 404 784"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={4}
                height={4}
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width={404}
            height={784}
            fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)"
          />
        </svg>

        <div className="relative">
          <h2 className="text-center text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Local, Talent, Service : Le Triangle de la Réussite
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-gray-500">
            Votre talent, votre voix. Découvrez les prestataires de confiance ou
            partagez vos compétences uniques sur Agorasafe.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
          <div className="relative">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Trouvez l'expert dont vous avez besoin
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              Trouvez des prestataires locaux qualifiés pour répondre à tous vos
              besoins, qu'il s'agisse de petits travaux, de services du
              quotidien ou de projets spéciaux. Laissez nos prestataires vous
              aider à réaliser vos rêves.
            </p>

            <dl className="mt-10 space-y-10">
              {customerFeatures.map(item => (
                <div key={item.id} className="relative">
                  <dt>
                    <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
                      <item.icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                      {item.name}
                    </p>
                  </dt>
                  <dd className="ml-16 mt-2 text-base text-gray-500">
                    {item.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative -mx-4 mt-10 lg:mt-0" aria-hidden="true">
            <svg
              className="absolute left-1/2 -translate-x-1/2 translate-y-16 transform lg:hidden"
              width={784}
              height={404}
              fill="none"
              viewBox="0 0 784 404"
            >
              <defs>
                <pattern
                  id="ca9667ae-9f92-4be7-abcb-9e3d727f2941"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={784}
                height={404}
                fill="url(#ca9667ae-9f92-4be7-abcb-9e3d727f2941)"
              />
            </svg>
            <img
              className="relative mx-auto h-[550px] w-[490px] rounded-md object-cover shadow-md"
              src="/images/maman-africaine-phone.jpg"
              alt="Maman africaine"
            />
          </div>
        </div>

        <svg
          className="absolute right-full hidden translate-x-1/2 translate-y-12 transform lg:block"
          width={404}
          height={784}
          fill="none"
          viewBox="0 0 404 784"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={4}
                height={4}
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width={404}
            height={784}
            fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)"
          />
        </svg>

        <div className="relative mt-12 sm:mt-16 lg:mt-24">
          <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:items-center lg:gap-8">
            <div className="lg:col-start-2">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Faites grandir vos finances
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                Si vous êtes un professionnel talentueux, rejoignez notre
                plateforme pour accéder à une clientèle locale avide de vos
                compétences. Faites grandir vos finances en offrant vos services
                et en atteignant de nouveaux sommets de réussite.
              </p>

              <dl className="mt-10 space-y-10">
                {providerFeatures.map(item => (
                  <div key={item.id} className="relative">
                    <dt>
                      <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
                        <item.icon className="h-8 w-8" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                        {item.name}
                      </p>
                    </dt>
                    <dd className="ml-16 mt-2 text-base text-gray-500">
                      {item.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative -mx-4 mt-10 lg:col-start-1 lg:mt-0">
              <svg
                className="absolute left-1/2 -translate-x-1/2 translate-y-16 transform lg:hidden"
                width={784}
                height={404}
                fill="none"
                viewBox="0 0 784 404"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="e80155a9-dfde-425a-b5ea-1f6fadd20131"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x={0}
                      y={0}
                      width={4}
                      height={4}
                      className="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width={784}
                  height={404}
                  fill="url(#e80155a9-dfde-425a-b5ea-1f6fadd20131)"
                />
              </svg>
              <img
                className="relative mx-auto h-[550px] w-[490px] rounded-md object-cover shadow-md"
                src="/images/femme-menage.jpg"
                alt="femme menage"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
