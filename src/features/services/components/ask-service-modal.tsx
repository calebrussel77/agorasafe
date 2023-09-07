import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React, {
  type FC,
  type ReactElement,
  useCallback,
  useState,
} from 'react';

import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { DebouncedInput } from '@/components/ui/debounced-input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FadeAnimation } from '@/components/ui/fade-animation';

import { cn } from '@/lib/utils';

import { useGetAllServiceCategories, useGetAllServices } from '../services';
import { type ServiceCategoryItem } from '../types';
import { AskServiceItem } from './ask-service-item';

interface AskServiceModalProps {
  className?: string;
  children?: ReactElement;
}

const AskServiceModal: FC<AskServiceModalProps> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategoryItem | undefined
  >(undefined);

  const [query, setQuery] = useState('');

  const { data, isFetching, error } = useGetAllServiceCategories();
  const {
    data: dataServices,
    isFetching: isLoadingServices,
    error: errorServices,
  } = useGetAllServices(
    { categoryServiceId: selectedCategory?.id || undefined, query },
    { enabled: !!selectedCategory || !!query }
  );

  const onSelectCategory = useCallback(
    (categoryService: ServiceCategoryItem) =>
      setSelectedCategory(categoryService),
    []
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>{children}</span>
      </DialogTrigger>
      <DialogContent className="px-4 sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {selectedCategory ? (
              <button
                className="mb-3 flex items-center"
                onClick={() => setSelectedCategory(undefined)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>{selectedCategory.name}</span>
              </button>
            ) : (
              <span>Demander un service</span>
            )}
          </DialogTitle>
          {!selectedCategory && (
            <DialogDescription>
              Explorez les nombreuses catégories de services que nous proposons.
              Si vous ne trouvez pas votre service, vous avez la possibilité
              d'en créer un de manière personnalisée.
            </DialogDescription>
          )}
          <DebouncedInput
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="mt-1 bg-gray-100 hover:bg-gray-200"
            placeholder="Recherchez un service ici..."
            type="search"
          />
        </DialogHeader>
        <div
          className={cn(
            'relative mx-2 mb-6 h-full flex-1 overflow-x-hidden px-2'
          )}
        >
          {!query && (
            <AsyncWrapper isLoading={isFetching} error={error}>
              <FadeAnimation
                className={cn(
                  'grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2'
                )}
                from={{ x: -620, opacity: 0 }}
                isVisible={!selectedCategory}
              >
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

          <AsyncWrapper isLoading={isLoadingServices} error={errorServices}>
            <FadeAnimation
              className={cn('grid grid-cols-1 gap-y-3')}
              from={{ x: 620, opacity: 0 }}
              isVisible={!!selectedCategory || !!query}
              animateEnter
            >
              {dataServices?.services?.map(service => (
                <Link
                  key={service.id}
                  href={`/publish-service-request/${service.id}`}
                  className="block w-full"
                >
                  <AskServiceItem name={service.name} />
                </Link>
              ))}
            </FadeAnimation>
          </AsyncWrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AskServiceModal };
