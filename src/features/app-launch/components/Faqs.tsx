import Image from 'next/future/image';

import backgroundImage from '../images/background-faqs.jpg';
import { Container } from './Container';

const faqs = [
  [
    {
      question: "Comment puis-je m'inscrire sur la plateforme ?",
      answer: `Pour vous inscrire, cliquez sur "Connexion" en haut de la page d'accueil Nous vous créerons un compte si vous n'en n'avez pas un déjà.`,
    },
    {
      question:
        'Comment puis-je créer une demande de service en tant que client ?',
      answer:
        'Une fois connecté sur votre profile Client, vous aurez un bouton "Demander un service". Cliquez dessus, puis remplissez les détails de votre demande, et les prestataires intéressés vous soumettront des offres.',
    },
    {
      question: 'Comment puis-je devenir un prestataire sur la plateforme ?',
      answer:
        'Créez votre compte en ajoutant un profil prestataire lors de votre embarquement, puis mettez à jour votre profil professionnel en mettant en avant vos compétences et votre expérience. Vous pourrez alors soumettre des offres pour des demandes de service.',
    },
  ],
  [
    {
      question: `Puis-je passer de l'utilisation d'un compte client à un compte prestataire (et vice-versa) ?`,
      answer:
        'Oui, vous pouvez facilement basculer entre les deux types de comptes dans les paramètres de votre profil.',
    },
    {
      question: 'Comment fonctionne le processus de paiement ?',
      answer:
        'Les paiements se font en ligne via notre système sécurisé (Orange money, MTN Mobile Money). Vous ne payez le prestataire que lorsque vous êtes satisfait du service.',
    },
    {
      question: 'Comment puis-je consulter les avis des clients ?',
      answer:
        'Les avis des clients sont visibles sur les profils des prestataires. Vous pouvez consulter les commentaires et les évaluations pour prendre une décision éclairée.',
    },
  ],
  [
    {
      question: 'Puis-je utiliser la plateforme sur mon appareil mobile ?',
      answer:
        "Oui bien sûr ! Le plateforme est totalement responsive et adaptée pour les appareils mobiles. Vous pourrez très bientôt l'installé comme une application native sur votre téléphone.",
    },
    {
      question: "Comment puis-je vérifier la crédibilité d'un prestataire ?",
      answer: `Consultez les évaluations et les recommandations laissées par d'autres clients. Vous pouvez également vérifier les informations de profil, y compris les certifications et l'expérience du prestataire.`,
    },
    {
      question:
        'Comment puis-je augmenter ma visibilité en tant que prestataire ?',
      answer:
        'Optimisez votre profil en ajoutant des informations détaillées, des photos de projets, et en obtenant de bonnes évaluations de clients satisfaits.',
    },
  ],
];

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Réponses à vos questions fréquentes
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Vous avez des interrogations sur notre plateforme ? Découvrez les
            réponses à certaines des questions les plus fréquentes posées par
            nos utilisateurs.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="text-lg font-semibold leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
