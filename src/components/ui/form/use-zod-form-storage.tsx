import { useCallback, useEffect, useRef } from 'react';
import {
  type EventType,
  type FieldPath,
  type UseFormReturn,
} from 'react-hook-form';
import { type Subscription } from 'react-hook-form/dist/utils/createSubject';
import { type z } from 'zod';

import { useDebouncer } from '@/utils/debouncer';

import { openConfirmModal } from '../modal/events';
import { toast } from '../toast';

export function useZodFormStorage<
  TSchema extends z.AnyZodObject | z.Schema,
  TContext
>({
  schema,
  timeout,
  form,
  key,
  watch,
}: {
  schema: TSchema;
  timeout: number;
  form: UseFormReturn<z.infer<TSchema>, TContext>;
  key: string;
  watch: (
    value: DeepPartial<z.infer<TSchema>>,
    info: {
      name?: FieldPath<z.infer<TSchema>>;
      type?: EventType;
    }
  ) => DeepPartial<z.infer<TSchema>> | void;
}) {
  const debouncer = useDebouncer(timeout);

  const subscriptionRef = useRef<Subscription>();
  const createSubscription = () => {
    subscriptionRef.current = form.watch((value, info) => {
      const watchedValue = watch(value as never, info);
      if (!watchedValue) return;
      debouncer(() => {
        localStorage.setItem(key, JSON.stringify(watchedValue));
      });
    });
  };

  useEffect(() => {
    /**
     * assign a value to subscription immediately if there is no localstorage value
     * or assign a value to subscription after the user has closed the `restore-confirm` modal
     */
    const storedValue = localStorage.getItem(key);
    if (!storedValue) createSubscription();
    else {
      const initialValue = JSON.parse(storedValue) as object;
      openConfirmModal({
        modalId: 'restore-confirm',
        title: 'Restore unsaved changes?',
        children:
          'Would you like to restore the unsaved changes from your previous session',
        labels: { cancel: `No`, confirm: `Yes` },
        onCancel: createSubscription,
        shouldCloseOnConfirm: true,
        onConfirm: () => {
          const result = schema.safeParse({
            ...form.getValues(),
            ...initialValue,
          });
          if (!result.success)
            toast({
              variant: 'danger',
              title: 'could not restore unsaved changes',
            });
          else form.reset(result.data as never);
        },
      });
    }

    return () => subscriptionRef.current?.unsubscribe();
  }, [key]);

  return useCallback(() => localStorage.removeItem(key), [key]);
}
