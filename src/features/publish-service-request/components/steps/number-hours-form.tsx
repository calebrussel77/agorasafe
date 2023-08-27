import { type TRPCClientErrorLike } from '@trpc/client';
import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CounterInput } from '@/components/ui/counter-input';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SectionMessage } from '@/components/ui/section-message';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';

import { cn } from '@/lib/utils';

import { type AppRouter } from '@/server/api/root';

import { useCatchNavigation } from '@/hooks/use-catch-navigation';

import {
  type PublishServiceRequest,
  usePublishServiceRequest,
} from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

type NumberHoursFormProps = {
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

const cardsInfo = [
  { label: '1h00', title: 'Court', value: 1 },
  { label: '2h00', title: 'Classique', value: 2 },
  { label: '3h00', title: 'Long', value: 3 },
];

type NumberHours = Pick<PublishServiceRequest, 'duration'>;

const NumberHoursForm = ({ error, isLoading }: NumberHoursFormProps) => {
  const router = useRouter();
  const { updateServiceRequest, serviceRequest } = usePublishServiceRequest();
  const { serviceSlug } = router.query as { serviceSlug: string };

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      duration: serviceRequest?.duration || 2,
    },
  });

  const {
    setValue,
    control,
    watch,
    formState: { isDirty, isSubmitted },
  } = form;

  const onHandleSubmit = (formData: NumberHours) => {
    updateServiceRequest(formData);
    void router.push(`/publish-service-request/${serviceSlug}/date`);
  };

  const watchDuration = watch('duration') as number;

  return (
    <>
      {error && <SectionMessage title={error.message} appareance="danger" />}
      <Form form={form} onSubmit={onHandleSubmit} className="space-y-16">
        <div className="grid grid-cols-3 gap-2">
          {cardsInfo?.map(card => (
            <button
              type="button"
              onClick={() => setValue('duration', card.value)}
              key={card.title}
              className={cn(
                'default__transition flex h-56 flex-col items-center justify-center rounded-lg border hover:border hover:border-brand-500 hover:bg-zinc-100',
                watchDuration === card.value &&
                  'border-2 border-brand-500 shadow-lg shadow-brand-500/20'
              )}
            >
              <Typography as="h2" className="text-brand-500">
                {card.label}
              </Typography>
              <Typography as="h3" className="mt-1 text-center">
                {card.title}
              </Typography>
            </button>
          ))}
        </div>
        <div className="relative flex justify-center">
          <Separator className="static" />
          <span className="absolute z-20 -mt-4 bg-white p-1.5 text-gray-500">
            Ou
          </span>
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <Typography className="mb-2">Ajuster l'heure manuellement</Typography>
          <Controller
            control={control}
            name="duration"
            render={({ field: { onChange, value, ...rest } }) => {
              return (
                <CounterInput
                  value={Number(value)}
                  onChange={onChange}
                  {...rest}
                />
              );
            }}
          />
        </div>
        <FixedFooterForm>
          <Button
            type="button"
            onClick={() => void router.back()}
            variant="ghost"
            size="lg"
          >
            Retour
          </Button>
          <Button size="lg">Suivant</Button>
        </FixedFooterForm>
      </Form>
    </>
  );
};

export { NumberHoursForm };
