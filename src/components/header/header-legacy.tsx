import { Menu } from 'lucide-react';
import { useRouter } from 'next/router';
import { type ReactNode, useRef } from 'react';

import { cn } from '@/lib/utils';

import { useAppearOnTarget } from '@/hooks/use-appear-on-target';

import { MobileNavbar, Navbar } from '../navbar';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

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
  'border-b',
  'bg-white',
  'text-gray-900',
  // 'bg-opacity-70',
  // 'bg__blurred',
];

const Header = ({ children }: { children?: ReactNode }) => {
  const headerRef = useRef<HTMLElement>(null);
  const {pathname} = useRouter();

  // Correspond of the first title of the home page
  const targetedSelector = '#home__changer';
  const isHomePage = pathname === '/';

  const { isAppear } = useAppearOnTarget({
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
          'default__transition sticky inset-x-0 top-0 z-50 -mt-24 text-white',
          !isHomePage && classNameList,
          !isHomePage && 'mt-0',
          isAppear && 'text-gray-900'
        )}
      >
        <Navbar
          navigations={navigations}
          isHeaderScrolled={isHomePage ? isAppear : true}
        >
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-[75%] bg-white p-0">
              <MobileNavbar navigations={navigations} />
            </SheetContent>
          </Sheet>
        </Navbar>
        {children}
      </header>
    </>
  );
};

export { Header };