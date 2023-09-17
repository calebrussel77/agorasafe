import Link from 'next/link';

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
      <CenterContent className="mx-auto w-full max-w-2xl">
        <Typography as="h1" className="text-brand-600">
          404
        </Typography>
        <Typography as="h2" className="mt-3 text-center font-normal">
          La page que vous recherchez n'existe pas ! Elle a peut être été
          déplacée.
        </Typography>
        <Button asChild className="mt-10">
          <Link href="/">Revenir à l'accueil</Link>
        </Button>
      </CenterContent>
    </>
  );
}
