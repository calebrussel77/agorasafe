import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CounterInput } from '@/components/ui/counter-input';
import { Form, useZodForm } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';

import { cn } from '@/lib/utils';

import {
  type PublishServiceRequestFormStore,
  usePublishServiceRequest,
} from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

const cardsInfo = [
  { label: '1h00', title: 'Court', value: 1 },
  { label: '2h00', title: 'Classique', value: 2 },
  { label: '3h00', title: 'Long', value: 3 },
];

type NumberHours = Pick<PublishServiceRequestFormStore, 'nbOfHours'>;
type NumberHoursFormProps = { nextStep: () => void; prevStep: () => void };

const NumberHoursForm = ({ nextStep, prevStep }: NumberHoursFormProps) => {
  const { query } = useRouter();
  const categorySlugQuery = query.category as string;

  const { updateServiceRequest, serviceRequest: _serviceRequest } =
    usePublishServiceRequest();
  const serviceRequest = _serviceRequest?.[categorySlugQuery];

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      nbOfHours: serviceRequest?.nbOfHours || 2,
    },
  });

  const { setValue, control, watch } = form;

  const onHandleSubmit = (formData: NumberHours) => {
    updateServiceRequest(formData, categorySlugQuery);

    nextStep();
  };

  const watchNbOfHours = watch('nbOfHours') as number;

  return (
    <>
      <Form form={form} onSubmit={onHandleSubmit} className="space-y-12">
        <div className="grid grid-cols-3 gap-2">
          {cardsInfo?.map(card => (
            <button
              type="button"
              onClick={() => setValue('nbOfHours', card.value)}
              key={card.title}
              className={cn(
                'default__transition flex h-36 flex-col items-center justify-center rounded-lg border hover:border hover:border-brand-500 hover:bg-zinc-100',
                watchNbOfHours === card.value &&
                  'border-2 border-brand-500 bg-zinc-100 shadow-lg shadow-brand-500/20'
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
            name="nbOfHours"
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
          <Button type="button" onClick={prevStep} variant="ghost" size="lg">
            Retour
          </Button>
          <Button size="lg">Suivant</Button>
        </FixedFooterForm>
      </Form>
    </>
  );
};

export { NumberHoursForm };
