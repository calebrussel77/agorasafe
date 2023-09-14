import { ArrowLeft, ChevronRight, PencilIcon } from 'lucide-react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  type FC,
  type ReactElement,
  type ReactNode,
  useCallback,
  useState,
} from 'react';

import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Button } from '@/components/ui/button';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeAnimation } from '@/components/ui/fade-animation';
import { GroupItem } from '@/components/ui/group-item';
import { Modal, useModal } from '@/components/ui/modal';

import { generateUrlWithSearchParams } from '@/utils/routing';

import { cn } from '@/lib/utils';

import { useGetAllServiceCategories, useGetAllServices } from '../services';
import { usePublishServiceRequest } from '../stores';
import {
  type GetAllServiceCategoriesOutput,
  type ServiceCategoryItem,
} from '../types';
import { AskServiceItem } from './ask-service-item';

interface AskServiceModalProps {
  className?: string;
  children?: ReactElement;
}

const AskServiceModal: FC<AskServiceModalProps> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategoryItem | undefined
  >(undefined);
  const { onOpenChange, open: isOpen } = useModal();
  const { reset, updateServiceRequest } = usePublishServiceRequest();
  const [query, setQuery] = useState('');

  const { data, isInitialLoading, error } = useGetAllServiceCategories(
    undefined,
    { enabled: isOpen }
  );

  const {
    data: dataServices,
    isInitialLoading: isServicesLoading,
    error: errorServices,
  } = useGetAllServices(
    { categoryServiceId: selectedCategory?.id, query },
    { enabled: !!selectedCategory || !!query }
  );

  const onSelectCategory = useCallback(
    (categoryService: ServiceCategoryItem) =>
      setSelectedCategory(categoryService),
    []
  );

  const onSelectService = ({
    categorySlug,
    title,
  }: {
    categorySlug: string;
    title: string;
  }) => {
    reset();
    updateServiceRequest({ title }, categorySlug);
    onOpenChange(false);
  };

  return (
    <Modal
      {...{ onOpenChange, open: isOpen }}
      classNames={{ root: 'px-4 sm:max-w-[625px]' }}
      trigger={<span>{children}</span>}
      triggerProps={{ asChild: true }}
      name={
        selectedCategory ? (
          <button
            className="mb-3 flex items-center"
            onClick={() => setSelectedCategory(undefined)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>{selectedCategory.name}</span>
          </button>
        ) : (
          <span>Demander un service</span>
        )
      }
      description={
        <>
          {!selectedCategory && (
            <>
              Explorez les nombreuses catégories de services que nous proposons.
              Si vous ne trouvez pas votre service, vous avez la possibilité
              d'en créer un de manière personnalisée.
            </>
          )}
          <DebouncedInput
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="mt-1 bg-gray-100 hover:bg-gray-200"
            placeholder="Recherchez un service ici..."
            type="search"
          />
        </>
      }
    >
      <div
        className={cn(
          'relative mx-2 mb-6 h-full flex-1 overflow-x-hidden px-2 pt-2'
        )}
      >
        {!query && (
          <AsyncWrapper isLoading={isInitialLoading} error={error}>
            <FadeAnimation
              className={cn('grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2')}
              from={{ x: -620, opacity: 0 }}
              isVisible={!selectedCategory}
            >
              {data?.categories?.length === 0 && (
                <EmptyState
                  icon={<Search />}
                  className="my-3"
                  name="Aucune catégorie trouvé"
                  description="Nous n'avons trouvés aucune catégorie à vous afficher."
                />
              )}

              {data?.categories?.map(category => (
                <AskServiceItem
                  onClick={() => onSelectCategory(category)}
                  key={category.id}
                  name={category.name}
                />
              ))}
            </FadeAnimation>
          </AsyncWrapper>
        )}

        <AsyncWrapper isLoading={isServicesLoading} error={errorServices}>
          <FadeAnimation
            className={cn('grid grid-cols-1 gap-y-3')}
            from={{ x: 620, opacity: 0 }}
            isVisible={!!selectedCategory || !!query}
            animateEnter
          >
            {dataServices?.services?.length === 0 && (
              <EmptyState
                icon={<Search />}
                className="my-3"
                name="Aucun résultats trouvés"
                description="Nous n'avons trouvés aucun résultat pour votre recherche. Créer une demande personnalisée ?"
                primaryAction={
                  <CustomServiceRequestCategoriesModal
                    query={query}
                    categories={data?.categories as never}
                  >
                    <Button>Faire une demande personnalisée</Button>
                  </CustomServiceRequestCategoriesModal>
                }
              />
            )}
            {dataServices?.services && dataServices?.services?.length > 0 && (
              <>
                {dataServices?.services?.map(service => (
                  <Link
                    key={service?.id}
                    onClick={() =>
                      void onSelectService({
                        categorySlug: service?.categoryService?.slug as string,
                        title: service?.name,
                      })
                    }
                    href={generateUrlWithSearchParams(
                      '/publish-service-request',
                      {
                        category: service?.categoryService?.slug as string,
                        title: query,
                        mode: 'normal',
                      }
                    )}
                    className="block w-full"
                  >
                    <AskServiceItem name={service?.name} />
                  </Link>
                ))}
                <CustomServiceRequestCategoriesModal
                  query={query}
                  categories={data?.categories as never}
                >
                  <GroupItem
                    classNames={{
                      root: 'py-4 bg-gray-100 rounded-md mt-6 group cursor-pointer',
                      name: 'font-normal text-base text-gray-600',
                      description: 'font-semibold text-xl text-gray-900',
                    }}
                    name="Vous ne trouvez pas votre bonheur ?"
                    description="Créer une demande personalisée"
                    iconBefore={
                      <PencilIcon className="h-8 w-8 text-brand-600" />
                    }
                    iconAfter={
                      <ChevronRight className="h-5 w-5 text-gray-600 opacity-0 group-hover:opacity-100" />
                    }
                  />
                </CustomServiceRequestCategoriesModal>
              </>
            )}
          </FadeAnimation>
        </AsyncWrapper>
      </div>
    </Modal>
  );
};

const CustomServiceRequestCategoriesModal = ({
  categories,
  query,
  children,
}: {
  query?: string;
  children: ReactNode;
  categories: GetAllServiceCategoriesOutput['categories'];
}) => {
  const router = useRouter();

  return (
    <Modal
      triggerProps={{ asChild: true }}
      classNames={{ root: 'px-4 sm:max-w-[625px]' }}
      name="Pour quelle catégorie ?"
      trigger={children}
    >
      <div className="relative mx-2 mb-6 h-full flex-1 overflow-x-hidden px-2">
        <FadeAnimation
          className={cn('grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2')}
          from={{ x: -620, opacity: 0 }}
          isVisible={true}
          animateEnter
        >
          {categories?.map(category => (
            <AskServiceItem
              onClick={() =>
                void router?.push(
                  generateUrlWithSearchParams('/publish-service-request', {
                    category: category?.slug as string,
                    title: query,
                    mode: 'custom',
                  })
                )
              }
              key={category.id}
              name={category.name}
            />
          ))}
        </FadeAnimation>
      </div>
    </Modal>
  );
};
export { AskServiceModal };
