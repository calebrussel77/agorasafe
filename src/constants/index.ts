import { ProfileType } from '@prisma/client';

export const siteProfiles = [
  {
    title: 'Prestataire',
    description: `Je souhaite vendre mes services auprès des clients de la plateforme.`,
    type: ProfileType.PROVIDER,
  },
  {
    title: 'Client',
    description: `Je souhaite créer des démandes de services et payer des personnes capables de satisfaire mon besoin.`,
    type: ProfileType.CUSTOMER,
  },
];
