import { type TRPCClientErrorLike } from '@trpc/client';
import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, useZodForm } from '@/components/ui/form';
import { SectionMessage } from '@/components/ui/section-message';

import { addDurationToDate } from '@/lib/date-fns';

import { type AppRouter } from '@/server/api/root';

import { useCatchNavigation } from '@/hooks/use-catch-navigation';

import {
  type PublishServiceRequest,
  usePublishServiceRequest,
} from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

type DateFormProps = {
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

type DateFormType = Pick<PublishServiceRequest, 'startDate'>;

const DateForm = ({ error, isLoading }: DateFormProps) => {
  const router = useRouter();
  const { serviceSlug } = router.query as { serviceSlug: string };
  const { updateServiceRequest, serviceRequest } = usePublishServiceRequest();

  const defaultStartDate = addDurationToDate(new Date(), { days: 1 });

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      startDate: serviceRequest?.startDate
        ? new Date(serviceRequest?.startDate)
        : undefined,
    },
  });

  const {
    control,
    formState: { isDirty, isSubmitted },
  } = form;

  const onHandleSubmit = (formData: DateFormType) => {
    updateServiceRequest(formData);
    void router.push(`/publish-service-request/${serviceSlug}/start-hour`);
  };

  return (
    <>
      {error && <SectionMessage title={error.message} appareance="danger" />}
      <Form form={form} onSubmit={onHandleSubmit}>
        <div className="flex justify-center">
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, value, ...rest } }) => {
              return (
                <Calendar
                  mode="single"
                  numberOfMonths={2}
                  captionLayout="dropdown-buttons"
                  fromDate={defaultStartDate}
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

export { DateForm };
