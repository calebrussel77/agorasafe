import { ArrowLeft, ChevronRight, PencilIcon } from 'lucide-react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { Anchor } from '@/components/anchor';
import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Button } from '@/components/ui/button';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeAnimation } from '@/components/ui/fade-animation';
import { GroupItem } from '@/components/ui/group-item';
import {
  type ContextModalProps,
  ModalHeader,
  ModalMain,
  openContextModal,
} from '@/components/ui/modal';

import { api } from '@/utils/api';

import { QS } from '@/lib/qs';
import { cn } from '@/lib/utils';

import { useIsMobile } from '@/hooks/use-breakpoints';

import { usePublishServiceRequest } from '../stores';
import {
  type GetAllServiceCategoriesOutput,
  type ServiceCategoryItem,
} from '../types';
import { AskServiceItem } from './ask-service-item';

const CreateServiceRequestModal = ({
  context: ctx,
  id,
}: ContextModalProps<object>) => {
  const isMobile = useIsMobile();

  const [selectedServiceCategory, onSelectedCategoryChange] = useState<
    ServiceCategoryItem | undefined
  >(undefined);

  const { reset, updateServiceRequest } = usePublishServiceRequest();
  const [query, setQuery] = useState('');

  const {
    data,
    isLoading: isInitialLoading,
    error,
  } = api.services.getAllServiceCategory.useQuery({});

  const {
    data: dataServices,
    isInitialLoading: isServicesLoading,
    error: errorServices,
  } = api.services.getAll.useQuery(
    { query, categoryServiceId: selectedServiceCategory?.id },
    { enabled: !!selectedServiceCategory || !!query }
  );

  const closeDialog = () => {
    ctx.closeModal(id);
  };

  const onSelectService = ({
    categorySlug,
    title,
    serviceSlug,
  }: {
    categorySlug: string;
    title: string;
    serviceSlug: string;
  }) => {
    reset();
    updateServiceRequest({ title, serviceSlug }, categorySlug);
    closeDialog();
  };

  return (
    <>
      <ModalHeader
        title={
          selectedServiceCategory ? (
            <button
              className="mb-3 flex items-center"
              onClick={() => onSelectedCategoryChange(undefined)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {selectedServiceCategory.name}
            </button>
          ) : (
            <span>Demander un service</span>
          )
        }
        description={
          <>
            {!selectedServiceCategory && (
              <>
                Explorez les nombreuses catégories de services que nous
                proposons. Si vous ne trouvez pas votre service, vous avez la
                possibilité d'en créer un de manière personnalisée.
              </>
            )}
            <DebouncedInput
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="mt-1.5 bg-gray-100 hover:bg-gray-200"
              placeholder="Recherchez un service ici..."
              type="search"
            />
          </>
        }
      />
      <ModalMain className="relative overflow-hidden">
        {!query && (
          <AsyncWrapper isLoading={isInitialLoading} error={error}>
            <FadeAnimation
              className={cn('grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2')}
              from={{ x: -620, opacity: 0 }}
              isVisible={!selectedServiceCategory}
            >
              {data?.map(category => (
                <AskServiceItem
                  onClick={() => onSelectedCategoryChange(category)}
                  key={category.id}
                  name={category.name}
                />
              ))}
            </FadeAnimation>

            {data?.length === 0 && (
              <EmptyState
                icon={<Search />}
                className="my-3"
                name="Aucune catégorie trouvé"
                description="Nous n'avons trouvés aucune catégorie à vous afficher."
              />
            )}
          </AsyncWrapper>
        )}

        <AsyncWrapper isLoading={isServicesLoading} error={errorServices}>
          <FadeAnimation
            className={cn('grid grid-cols-1 gap-y-3')}
            from={{ x: 620, opacity: 0 }}
            isVisible={!!selectedServiceCategory || !!query}
            animateEnter
          >
            {dataServices?.length === 0 && (
              <EmptyState
                icon={<Search />}
                className="my-3"
                name="Aucun résultats trouvés"
                description="Nous n'avons trouvés aucun résultat pour votre recherche. Créer une demande personnalisée ?"
                primaryAction={
                  <Button
                    onClick={() => {
                      openContextModal({
                        isFullScreen: isMobile,
                        modal: 'customServiceRequestCategories',
                        innerProps: {
                          categories: dataServices as never,
                          query,
                        },
                      });
                    }}
                  >
                    Faire une demande personnalisée
                  </Button>
                }
              />
            )}
            {dataServices && dataServices?.length > 0 && (
              <>
                {dataServices?.map(service => (
                  <Anchor
                    key={service?.id}
                    onClick={() =>
                      void onSelectService({
                        categorySlug: service?.categoryService?.slug as string,
                        title: service?.name,
                        serviceSlug: service?.slug as string,
                      })
                    }
                    href={`/service-requests/create?${QS.stringify({
                      category: service?.categoryService?.slug as string,
                      title: query,
                      mode: 'normal',
                    })}`}
                    className="block w-full"
                  >
                    <AskServiceItem name={service?.name} />
                  </Anchor>
                ))}
                <GroupItem
                  onClick={() => {
                    openContextModal({
                      isFullScreen: isMobile,
                      modal: 'customServiceRequestCategories',
                      innerProps: {
                        categories: dataServices as never,
                        query,
                      },
                    });
                  }}
                  classNames={{
                    root: 'py-4 mx-1 bg-gray-100 rounded-md mt-6 group cursor-pointer',
                    name: 'font-normal text-base text-gray-600',
                    description:
                      'font-semibold text-lg sm:text-xl text-gray-900',
                  }}
                  name="Vous ne trouvez pas votre bonheur ?"
                  description="Créer une demande personalisée"
                  iconBefore={
                    <PencilIcon className="ml-2 h-6 w-6 text-brand-600 sm:h-8 sm:w-8" />
                  }
                  iconAfter={
                    <ChevronRight className="h-5 w-5 text-gray-600 opacity-0 group-hover:opacity-100" />
                  }
                />
              </>
            )}
          </FadeAnimation>
        </AsyncWrapper>
      </ModalMain>
    </>
  );
};

const CustomServiceRequestCategoriesModal = ({
  context: ctx,
  id,
  innerProps: { categories, query },
}: ContextModalProps<{
  query?: string;
  categories: GetAllServiceCategoriesOutput;
}>) => {
  const router = useRouter();
  const onClose = () => ctx.closeModal(id);

  return (
    <>
      <ModalHeader
        title={
          <button className="mb-1 flex items-center" onClick={onClose}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Pour quelle catégorie ?
          </button>
        }
      />
      <ModalMain className="relative overflow-x-hidden">
        <FadeAnimation
          className={cn('grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2')}
          from={{ x: -620, opacity: 0 }}
          isVisible={true}
          animateEnter
        >
          {categories?.map(category => (
            <AskServiceItem
              onClick={() => {
                ctx.closeAll();
                void router?.push(
                  `/service-requests/create?${QS.stringify({
                    category: category?.slug as string,
                    title: query,
                    mode: 'custom',
                  })}`
                );
              }}
              key={category.id}
              name={category.name}
            />
          ))}
        </FadeAnimation>
      </ModalMain>
    </>
  );
};

export { CreateServiceRequestModal, CustomServiceRequestCategoriesModal };
