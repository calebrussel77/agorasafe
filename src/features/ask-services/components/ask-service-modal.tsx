import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React, {
  type FC,
  type ReactElement,
  useCallback,
  useState,
} from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FadeAnimation } from '@/components/ui/fade-animation';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

import { AskServiceItem } from './ask-service-item';

const categories = [
  { id: 1, name: 'Bricolage' },
  { id: 2, name: 'Informatique' },
  { id: 3, name: 'Coiffure' },
  { id: 4, name: 'Démenagement' },
  { id: 5, name: 'Ménage' },
  { id: 6, name: 'Cours particuliers' },
  { id: 7, name: 'Aides diverses' },
];

const services = [
  { id: 1, name: 'Installation et configuration de logiciels' },
  { id: 2, name: "Réparation d'ordinateurs et de périphériques" },
  { id: 3, name: 'Assistance technique à distance' },
  {
    id: 4,
    name: "Formation à l'utilisation d'un logiciel ou d'un système d'exploitation",
  },
  { id: 5, name: 'Installation et configuration de réseaux domestiques' },
  { id: 6, name: 'Récupération de données perdues ou supprimées' },
  {
    id: 7,
    name: "Mise à jour et amélioration des performances d'un ordinateur",
  },
  {
    id: 8,
    name: 'Installation et configuration de périphériques (imprimantes, scanners, etc.)',
  },
  { id: 9, name: 'Élimination de virus et de logiciels malveillants' },
  { id: 10, name: 'Sauvegarde et récupération de données' },
  { id: 11, name: "Configuration et sécurisation d'une connexion Internet" },
  {
    id: 12,
    name: "Installation et configuration de systèmes d'exploitation (Windows, macOS, Linux)",
  },
  {
    id: 13,
    name: 'Configuration et gestion des e-mails et des boîtes de réception',
  },
  { id: 14, name: 'Optimisation de la navigation sur Internet' },
  {
    id: 15,
    name: 'Configuration et utilisation des logiciels de bureautique (Microsoft Office, Google Suite)',
  },
  {
    id: 16,
    name: 'Configuration et utilisation des logiciels de retouche photo et de montage vidéo',
  },
  {
    id: 17,
    name: 'Installation et configuration de solutions de stockage en ligne (cloud)',
  },
  { id: 18, name: 'Configuration et utilisation des réseaux sociaux' },
  {
    id: 19,
    name: "Assistance à l'achat et à la configuration de nouveaux ordinateurs",
  },
  {
    id: 20,
    name: 'Configuration et utilisation des appareils mobiles (smartphones, tablettes)',
  },
  { id: 21, name: 'Configuration et utilisation des applications mobiles' },
  {
    id: 22,
    name: 'Sécurisation des données personnelles et de la vie privée en ligne',
  },
  {
    id: 23,
    name: "Conseils pour l'achat de matériel informatique et de logiciels",
  },
  {
    id: 24,
    name: 'Configuration et utilisation des systèmes de sauvegarde automatique',
  },
  { id: 25, name: 'Développement de sites web personnels ou de blogs' },
  { id: 26, name: 'Installation et configuration de systèmes de domotique' },
  {
    id: 27,
    name: 'Configuration et utilisation des services de streaming et de divertissement en ligne',
  },
  {
    id: 28,
    name: 'Assistance à la création et à la gestion de comptes en ligne (banque, commerce électronique, etc.)',
  },
  {
    id: 29,
    name: 'Configuration et utilisation des outils de vidéoconférence et de communication en ligne',
  },
  {
    id: 30,
    name: 'Conseils et assistance pour la protection contre le cybercrime et les fraudes en ligne',
  },
];

interface AskServiceModalProps {
  className?: string;
  children?: ReactElement;
}

const AskServiceModal: FC<AskServiceModalProps> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    (typeof categories)[0] | undefined
  >(undefined);

  const onSelectCategory = useCallback(
    (categoryService: (typeof categories)[0]) =>
      setSelectedCategory(categoryService),
    []
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="px-4 sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {selectedCategory ? (
              <button
                className="mb-3 flex items-center"
                onClick={() => setSelectedCategory(undefined)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>{selectedCategory.name}</span>
              </button>
            ) : (
              <span>Demander un service</span>
            )}
          </DialogTitle>
          {!selectedCategory && (
            <DialogDescription>
              Explorez les nombreuses catégories de services que nous proposons.
              Si vous ne trouvez pas votre service, vous avez la possibilité
              d'en créer un de manière personnalisée.
            </DialogDescription>
          )}
          <Input
            className="mt-1 bg-gray-100 hover:bg-gray-200"
            placeholder="Recherchez un service ici..."
            type="search"
          />
        </DialogHeader>
        <div
          className={cn(
            'relative mx-2 mb-6 h-full flex-1 overflow-x-hidden px-2'
          )}
        >
          <FadeAnimation
            className={cn('grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2')}
            from={{ x: -620, opacity: 0 }}
            isVisible={!selectedCategory}
          >
            {categories?.map(category => (
              <AskServiceItem
                onClick={() => onSelectCategory(category)}
                key={category.id}
                name={category.name}
              />
            ))}
          </FadeAnimation>
          <FadeAnimation
            className={cn('grid grid-cols-1 gap-y-3')}
            from={{ x: 620, opacity: 0 }}
            isVisible={!!selectedCategory}
            animateEnter
          >
            {services?.map(service => (
              <Link
                key={service.id}
                href={`/publish-new-service?service_item=${service.id}`}
                className="block w-full"
              >
                <AskServiceItem name={service.name} />
              </Link>
            ))}
          </FadeAnimation>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AskServiceModal };
