import React, { type FC } from 'react';

import { LogoIcon } from '../icons/logo-icon';
import { Inline } from '../ui/inline';

const footerNavigation = {
  solutions: [
    { name: 'Marketing', href: '#' },
    { name: 'Analytics', href: '#' },
    { name: 'Commerce', href: '#' },
    { name: 'Insights', href: '#' },
  ],
  support: [
    { name: 'Pricing', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Guides', href: '#' },
    { name: 'API Status', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Jobs', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  legal: [
    { name: 'Claim', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
};

interface FooterProps {
  className?: string;
}

const Footer: FC<FooterProps> = () => {
  return (
    <footer className="w-full mt-32">
      <div className="max-w-7xl mx-auto border-t border-gray-200 py-10">
        <LogoIcon className="mx-auto h-5 md:h-7 w-auto" />
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
              className="font-semibold hover:underline hover:text-primary-500"
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
