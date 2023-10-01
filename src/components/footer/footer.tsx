import React, { type FC } from 'react';

import { LogoIcon } from '../icons/logo-icon';
import { Inline } from '../ui/inline';

interface FooterProps {
  className?: string;
}

const Footer: FC<FooterProps> = () => {
  return (
    <footer className="mt-6 w-full">
      <div className="mx-auto max-w-7xl py-10">
        <LogoIcon className="mx-auto h-5 w-auto md:h-6" />
        <p className="mt-5 text-center text-sm leading-6 text-slate-500">
          &copy; {new Date().getFullYear()} Agorasafe. Tous droits réservés.
        </p>
        <div className="mt-3 flex items-center justify-center gap-1 text-center text-sm leading-6 text-slate-500">
          Réalisé par{' '}
          <Inline>
            <a
              href="https://twitter.com/CalebElat"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary-500 font-semibold hover:underline"
            >
              Caleb Russel
            </a>
          </Inline>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
