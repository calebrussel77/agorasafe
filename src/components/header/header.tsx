import { Menu } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { MobileNavbar, Navbar } from '@/components/navbar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { isWindowDefined } from '@/utils/type-guards';

import { cn } from '@/lib/utils';

const navigations = [
  { name: 'Explorer', href: '#', isNew: false },
  { name: 'Les mieux notés', href: '#', isNew: false },
  // { name: 'Devenir prestataire', href: '#', isNew: false },
  { name: 'Feedback', href: '', isNew: true },
];

const Header = ({ children }: { children?: ReactNode }) => {
  const [isOpenSheet, setIsOpenSheet] = useState(false);

  const isHomePage = isWindowDefined()
    ? window.location.pathname === '/'
    : false;

  return (
    <>
      <header
        className={cn(
          'default__transition sticky inset-x-0 top-0 z-50 border-b bg-white',
          isHomePage && 'bg-slate-50'
        )}
      >
        <Navbar navigations={navigations} isHeaderScrolled={true}>
          <Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-[75%] bg-white p-0">
              <MobileNavbar
                navigations={navigations}
                onNavItemClick={() => setIsOpenSheet(false)}
              />
            </SheetContent>
          </Sheet>
        </Navbar>
        {children}
      </header>
    </>
  );
};

export { Header };
