import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, useZodForm } from '@/components/ui/form';

import { addDurationToDate } from '@/lib/date-fns';

import {
  type PublishServiceRequestFormStore,
  usePublishServiceRequest,
} from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

type DateFormType = Pick<PublishServiceRequestFormStore, 'date'>;
type DateFormProps = { nextStep: () => void; prevStep: () => void };

const DateForm = ({ nextStep, prevStep }: DateFormProps) => {
  const router = useRouter();
  const categorySlugQuery = router?.query?.category as string;

  const { updateServiceRequest, serviceRequest: _serviceRequest } =
    usePublishServiceRequest();
  const serviceRequest = _serviceRequest?.[categorySlugQuery];

  const defaultDate = addDurationToDate(new Date(), { days: 1 });
  const defaultEndDate = addDurationToDate(new Date(), { months: 1 });

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      date: serviceRequest?.date ? new Date(serviceRequest?.date) : undefined,
    },
  });

  const { control } = form;

  const onHandleSubmit = (formData: DateFormType) => {
    updateServiceRequest(formData, categorySlugQuery);

    nextStep();
  };

  return (
    <>
      <Form form={form} onSubmit={onHandleSubmit}>
        <div className="flex justify-center">
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value, ...rest } }) => {
              return (
                <Calendar
                  mode="single"
                  numberOfMonths={2}
                  fromDate={defaultDate}
                  toDate={defaultEndDate}
                  selected={value as Date}
                  onSelect={onChange}
                  className="rounded-md border shadow-md"
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

export { DateForm };
