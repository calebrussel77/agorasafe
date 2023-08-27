import { SectionMessage, type SectionMessageProps } from '../section-message';

const errors: Record<string, string> = {
  Signin:
    "Une erreur s'est produite. Réessayez plus tard ou essayez de vous connecter avec un autre compte.",
  OAuthSignin:
    "Une erreur s'est produite. Réessayez plus tard ou essayez de vous connecter avec un autre compte.",
  OAuthCallback:
    "Une erreur s'est produite. Réessayez plus tard ou essayez de vous connecter avec un autre compte.",
  OAuthCreateAccount:
    "Une erreur s'est produite. Réessayez plus tard ou essayez de vous connecter avec un autre compte.",
  EmailCreateAccount:
    "Une erreur s'est produite. Réessayez plus tard ou essayez de vous connecter avec un autre compte.",
  Callback:
    "Une erreur s'est produite. Réessayez plus tard ou essayez de vous connecter avec un autre compte.",
  OAuthAccountNotLinked:
    "Pour confirmer votre identité, connectez-vous avec le même compte que celui que vous avez utilisé à l'origine.",
  EmailSignin: 'Vérifiez votre adresse électronique.',
  CredentialsSignin:
    'La connexion a échoué. Vérifiez que les informations que vous avez fournies sont correctes.',
  default: 'Impossible de se connecter.',
};

type SignInErrorProps = { error: string } & Omit<
  SectionMessageProps,
  'children'
>;

export const SignInError = ({
  error,
  ...sectionMessageProps
}: SignInErrorProps) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return (
    <SectionMessage
      title={errorMessage}
      appareance="danger"
      isSticky
      {...sectionMessageProps}
    />
  );
};
