import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { FixedFooterContainer } from '@/components/fixed-footer-container';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { HelperMessage } from '@/components/ui/helper-message';

import { dateToReadableString, increaseDate } from '@/lib/date-fns';
import { cn } from '@/lib/utils';

import {
  type PublishServiceRequestFormStore,
  usePublishServiceRequest,
} from '../../stores';

type DateFormType = Pick<PublishServiceRequestFormStore, 'date'>;
type DateFormProps = { nextStep: () => void; prevStep: () => void };

const DateForm = ({ nextStep, prevStep }: DateFormProps) => {
  const { query } = useRouter();
  const categorySlugQuery = query.category as string;

  const { updateServiceRequest, serviceRequest: _serviceRequest } =
    usePublishServiceRequest();
  const serviceRequest = _serviceRequest?.[categorySlugQuery];

  const defaultDate = increaseDate(new Date(), { days: 1 });
  const defaultEndDate = increaseDate(new Date(), { months: 1 });

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      date: serviceRequest?.date ? new Date(serviceRequest?.date) : undefined,
    },
  });

  const { control } = form;

  const watchedDate = form.watch('date') as Date;

  const onHandleSubmit = (formData: DateFormType) => {
    updateServiceRequest(formData, categorySlugQuery);

    nextStep();
  };

  return (
    <>
      <Form form={form} onSubmit={onHandleSubmit}>
        <div className="">
          <Controller
            control={control}
            rules={{ required: 'La date est requise' }}
            name="date"
            render={({ field: { onChange, value, ...rest }, fieldState }) => {
              return (
                <Field error={fieldState?.error?.message}>
                  <Calendar
                    mode="single"
                    numberOfMonths={2}
                    fromDate={defaultDate}
                    toDate={defaultEndDate}
                    selected={value as Date}
                    onSelect={onChange}
                    className={cn(
                      'flex justify-center rounded-md border shadow-md',
                      fieldState?.error?.message && 'border-2 border-red-500'
                    )}
                    {...rest}
                  />
                </Field>
              );
            }}
          />
          {watchedDate && (
            <HelperMessage className="mt-2 text-sm text-muted-foreground">
              Le {dateToReadableString(watchedDate)}
            </HelperMessage>
          )}
        </div>
        <FixedFooterContainer>
          <Button type="button" onClick={prevStep} variant="ghost" size="lg">
            Retour
          </Button>
          <Button size="lg">Suivant</Button>
        </FixedFooterContainer>
      </Form>
    </>
  );
};

export { DateForm };
