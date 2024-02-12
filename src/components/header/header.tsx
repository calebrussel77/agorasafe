import { Menu } from 'lucide-react';
import { useRouter } from 'next/router';
import { type ReactNode, useState } from 'react';

import { MobileNavbar, Navbar } from '@/components/navbar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { cn } from '@/lib/utils';

const navigations = [
  { name: 'Explorer', href: '/service-requests', isNew: false, isSoon: false },
  { name: 'Les mieux notés', href: '#', isNew: false, isSoon: true },
  // { name: 'Devenir prestataire', href: '#', isNew: false },
  { name: 'Feedback', href: '', isNew: true, isSoon: false },
];

const Header = ({ children }: { children?: ReactNode }) => {
  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const router = useRouter();

  const isHomePage = router.asPath === '/';

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
                closeSideBar={() => setIsOpenSheet(false)}
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
