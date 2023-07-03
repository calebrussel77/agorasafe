import { Menu } from 'lucide-react';
import { useRouter } from 'next/router';
import { Fragment, useRef } from 'react';

import { cn } from '@/lib/utils';

import { useAppearOnTarget } from '@/hooks/use-appear-on-target';

import { MobileNavbar, Navbar } from '../navbar';
import { Sheet } from '../ui/sheet';

const navigations = [
  { name: 'Explorer', href: '#' },
  { name: 'Les mieux notés', href: '#' },
  { name: 'Devenir prestataire', href: '#' },
  // { name: "M'acheter un café", href: '#' },
];

const options = {
  rootMargin: '-300px 0px 0px 0px',
};
const classNameList = [
  'shadow-md',
  'bg-gray-900',
  'bg-opacity-70',
  'bg__blurred',
];

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const router = useRouter();

  // Correspond of the first title of the home page
  const targetedSelector = '#home__changer';
  const isHomePage = router?.pathname === '/';

  useAppearOnTarget({
    elementRef: headerRef,
    targetedSelector,
    classNameList,
    options,
  });

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'sticky -mt-24 top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out',
          !isHomePage && classNameList,
          !isHomePage && 'mt-0'
        )}
      >
        <Navbar navigations={navigations}>
          <Sheet>
            <Sheet.Trigger asChild>
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </Sheet.Trigger>
            <Sheet.Content className="bg-white w-[70%] sm:w-1/2">
              <MobileNavbar navigations={navigations} />
            </Sheet.Content>
          </Sheet>
        </Navbar>
      </header>
    </>
  );
};

export { Header };
