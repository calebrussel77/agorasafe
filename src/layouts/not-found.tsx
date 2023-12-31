import { Button } from '@/components/ui/button';
import { CenterContent } from '@/components/ui/layout';
import { Seo } from '@/components/ui/seo';
import { Typography } from '@/components/ui/typography';

export function NotFound() {
  return (
    <>
      <Seo
        title="Page non touvée"
        description="La page que vous recherchez n'existe page ! Elle a peut être été
          déplacée."
      />
      <CenterContent className="max-w-2xl">
        <Typography as="h1" className="text-brand-600">
          404
        </Typography>
        <Typography as="h2" className="mt-3 text-center font-normal">
          La page que vous recherchez n'existe pas ! Elle a peut être été
          déplacée.
        </Typography>
        <Button href="/" className="mt-10">
          Revenir à l'accueil
        </Button>
      </CenterContent>
    </>
  );
}
