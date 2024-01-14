import { ArrowRight, LucideDoorClosed } from 'lucide-react';

import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { UserProviderCard } from '@/components/user-provider-card';

import { api } from '@/utils/api';

export function FeaturedProviders() {
  const { data, error, refetch, isLoading } = api.profiles.getProfiles.useQuery(
    {
      profileType: 'PROVIDER',
    }
  );

  return (
    <div className="bg-gray-50 py-12">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nos meilleurs prestataires
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Consultez nos prestataires les plus actifs.
          </p>
        </div>
        <AsyncWrapper
          isLoading={isLoading}
          error={error}
          onRetryError={refetch}
        >
          {data?.profiles && data?.profiles?.length === 0 && (
            <EmptyState
              icon={<LucideDoorClosed />}
              className="my-8"
              description="Aucun prestataires trouvés."
              primaryAction={
                <Button href="/auth/login" size="sm">
                  Devenir un prestataire
                </Button>
              }
            />
          )}
          {data?.profiles && data?.profiles?.length > 0 && (
            <div className="mx-auto mt-8 max-w-2xl lg:mx-0 lg:max-w-none">
              {data?.profiles?.length > 3 && (
                <div className="flex w-full justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    href="#"
                    className="w-auto text-brand-600 hover:bg-brand-100 hover:text-brand-700"
                  >
                    <span>Voir tous</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
              <div className="mt-2 grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {data?.profiles?.slice(0, 2)?.map(profile => {
                  return (
                    <UserProviderCard
                      key={profile?.id}
                      className="w-full"
                      profile={profile}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </AsyncWrapper>
      </div>
    </div>
  );
}
