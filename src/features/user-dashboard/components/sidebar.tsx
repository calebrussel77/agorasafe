import { Home } from 'lucide-react';

import { Anchor } from '@/components/anchor';
import { LogoIcon } from '@/components/icons/logo-icon';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ErrorWrapper, SectionError } from '@/components/ui/error';
import { GroupItem } from '@/components/ui/group-item';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';

import { useGetProfileConfig } from '@/features/profile-config';

import { generateArray } from '@/utils/misc';
import { isPathMatchRoute } from '@/utils/routing';

import { cn } from '@/lib/utils';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useHeaderHeight } from '@/hooks/use-header-height';

const Sidebar = () => {
  const {
    data: userProfileConfig,
    isInitialLoading,
    error,
  } = useGetProfileConfig();

  const { profile: currentProfile, isAuth } = useCurrentUser();

  const { height } = useHeaderHeight();

  const content = (
    <div className="mt-6 flex flex-col gap-3">
      <ErrorWrapper
        error={error}
        errorComponent={
          <SectionError
            hasActions={false}
            classNames={{ icon: 'h-32 w-auto' }}
            error={error}
          />
        }
      >
        {isInitialLoading ? (
          <div className="my-6 grid gap-3">
            {generateArray(8).map(el => (
              <div key={el} className="space-y-1.5 px-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {userProfileConfig?.appProfileLinks?.map(link => {
              const isProfileLink = link.id === 5;
              const url = isProfileLink
                ? `/u/${currentProfile?.slug}`
                : link.href;
              const isMatch = isPathMatchRoute(url);

              return (
                <Anchor href={url} key={link.id} className="w-full">
                  <GroupItem
                    iconBefore={
                      <Avatar
                        src={link.iconUrl}
                        alt={link.title}
                        shape="square"
                        className="mr-2 h-5 w-5 flex-shrink-0"
                      />
                    }
                    name={
                      <Typography as="h3" variant="paragraph">
                        {link.title}
                      </Typography>
                    }
                    description={
                      <Typography
                        variant="small"
                        className="text-muted-foreground"
                      >
                        {link.description}
                      </Typography>
                    }
                    className={isMatch ? 'bg-zinc-100 text-primary' : ''}
                  />
                </Anchor>
              );
            })}
          </div>
        )}
      </ErrorWrapper>
    </div>
  );

  return (
    <>
      {/* <Sheet>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="default"
            size="sm"
            className="fixed bottom-3 right-2 z-20 h-auto w-auto rounded-full p-3 shadow-lg shadow-brand-500/80 lg:hidden"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[75%] bg-white" side="left">
          <LogoIcon className="mb-4 h-5 w-auto" />
          {content}
        </SheetContent>
      </Sheet> */}
      <div
        style={{
          top: `calc(${height} - 20px)`,
          position: 'fixed',
        }}
        className="hidden h-full w-[320px] overflow-hidden border-r border-gray-300 bg-white px-4 sm:px-8 lg:block"
      >
        {content}
      </div>
    </>
  );
};

export { Sidebar };
