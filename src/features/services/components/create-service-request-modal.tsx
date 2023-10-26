import { openContext } from '@/providers/custom-modal-provider';
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
import { type ContextModalProps, ModalHeader } from '@/components/ui/modal';

import { QS } from '@/lib/qs';
import { cn } from '@/lib/utils';

import { useGetAllServiceCategories, useGetAllServices } from '../services';
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
  const [selectedServiceCategory, onSelectedCategoryChange] = useState<
    ServiceCategoryItem | undefined
  >(undefined);

  const { reset, updateServiceRequest } = usePublishServiceRequest();
  const [query, setQuery] = useState('');

  const { data, isInitialLoading, error } =
    useGetAllServiceCategories(undefined);

  const {
    data: dataServices,
    isInitialLoading: isServicesLoading,
    error: errorServices,
  } = useGetAllServices(
    { categoryServiceId: selectedServiceCategory?.id, query },
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
      <div className={cn('relative h-full flex-1 overflow-hidden p-6')}>
        {!query && (
          <AsyncWrapper isLoading={isInitialLoading} error={error}>
            <FadeAnimation
              className={cn('grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2')}
              from={{ x: -620, opacity: 0 }}
              isVisible={!selectedServiceCategory}
            >
              {data?.categories?.map(category => (
                <AskServiceItem
                  onClick={() => onSelectedCategoryChange(category)}
                  key={category.id}
                  name={category.name}
                />
              ))}
            </FadeAnimation>

            {data?.categories?.length === 0 && (
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
            {dataServices?.services?.length === 0 && (
              <EmptyState
                icon={<Search />}
                className="my-3"
                name="Aucun résultats trouvés"
                description="Nous n'avons trouvés aucun résultat pour votre recherche. Créer une demande personnalisée ?"
                primaryAction={
                  <Button
                    onClick={() =>
                      openContext('customServiceRequestCategories', {
                        categories: dataServices?.services as never,
                        query,
                      })
                    }
                  >
                    Faire une demande personnalisée
                  </Button>
                }
              />
            )}
            {dataServices?.services && dataServices?.services?.length > 0 && (
              <>
                {dataServices?.services?.map(service => (
                  <Anchor
                    key={service?.id}
                    onClick={() =>
                      void onSelectService({
                        categorySlug: service?.categoryService?.slug as string,
                        title: service?.name,
                        serviceSlug: service?.slug as string,
                      })
                    }
                    href={`/publish-service-request?${QS.stringify({
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
                  onClick={() =>
                    openContext('customServiceRequestCategories', {
                      categories: dataServices?.services as never,
                      query,
                    })
                  }
                  classNames={{
                    root: 'py-4 mx-1 bg-gray-100 rounded-md mt-6 group cursor-pointer',
                    name: 'font-normal text-base text-gray-600',
                    description: 'font-semibold text-xl text-gray-900',
                  }}
                  name="Vous ne trouvez pas votre bonheur ?"
                  description="Créer une demande personalisée"
                  iconBefore={
                    <PencilIcon className="ml-2 h-8 w-8 text-brand-600" />
                  }
                  iconAfter={
                    <ChevronRight className="h-5 w-5 text-gray-600 opacity-0 group-hover:opacity-100" />
                  }
                />
              </>
            )}
          </FadeAnimation>
        </AsyncWrapper>
      </div>
    </>
  );
};

const CustomServiceRequestCategoriesModal = ({
  context: ctx,
  id,
  innerProps: { categories, query },
}: ContextModalProps<{
  query?: string;
  categories: GetAllServiceCategoriesOutput['categories'];
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
      <div className="relative h-full flex-1 overflow-x-hidden p-6">
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
                  `/publish-service-request?${QS.stringify({
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
      </div>
    </>
  );
};

export { CreateServiceRequestModal, CustomServiceRequestCategoriesModal };
