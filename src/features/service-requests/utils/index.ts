import { type ServiceRequestStatus } from '@prisma/client';

export const generateHoursBetweenSevenAmAndtwentyOnePm = () =>
  Array.from({ length: 42 }, (_, index) => index / 2 + 0.5)?.slice(13);

export const mapServiceRequestStatus: Record<ServiceRequestStatus, string> = {
  OPEN: 'Ouvert',
  CLOSED: 'Fermé',
};

export const publishServiceSteps = [
  {
    title: 'Quel est votre besoin ?',
    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. At est
    modi aliquam rem quos cumque velit! Consequatur placeat, itaque,
    quod repudiandae deleniti ut eligendi minus fuga ratione, magni
    libero fugiat.`,
  },
  {
    title: 'De combien de personnes avez-vous besoin ?',
    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. At est
    modi aliquam rem quos cumque velit! Consequatur placeat, itaque,
    quod repudiandae deleniti ut eligendi minus fuga ratione, magni
    libero fugiat.`,
  },
  {
    title: "De combien d'heures de services avez-vous besoin ?",
    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. At est
    modi aliquam rem quos cumque velit! Consequatur placeat, itaque,
    quod repudiandae deleniti ut eligendi minus fuga ratione, magni
    libero fugiat.`,
  },
  {
    title: 'Quel jour vous convient le mieux ?',
    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. At est
    modi aliquam rem quos cumque velit! Consequatur placeat, itaque,
    quod repudiandae deleniti ut eligendi minus fuga ratione, magni
    libero fugiat.`,
  },
  {
    title: 'Quelle heure vous convient le mieux ?',
    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. At est
    modi aliquam rem quos cumque velit! Consequatur placeat, itaque,
    quod repudiandae deleniti ut eligendi minus fuga ratione, magni
    libero fugiat.`,
  },
  {
    title: "Quelle est l'adresse de la prestation ?",
    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. At est
    modi aliquam rem quos cumque velit! Consequatur placeat, itaque,
    quod repudiandae deleniti ut eligendi minus fuga ratione, magni
    libero fugiat.`,
  },
  {
    title:
      'À quel numéro de téléphone le prestataire pourra-t-il vous joindre ?',
    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. At est
    modi aliquam rem quos cumque velit! Consequatur placeat, itaque,
    quod repudiandae deleniti ut eligendi minus fuga ratione, magni
    libero fugiat.`,
  },
  {
    title: 'Souhaitez-vous ajouter des photos ? (optionnel)',
    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. At est
    modi aliquam rem quos cumque velit! Consequatur placeat, itaque,
    quod repudiandae deleniti ut eligendi minus fuga ratione, magni
    libero fugiat.`,
  },
];

export const LATEST_SERVICE_REQUESTS_COUNT = 6;

export const DEFAULT_SERVICE_REQUEST_COVER_IMAGE =
  '/images/artistique-cover-photo.jpg';
