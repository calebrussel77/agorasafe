import { type TRPCClientErrorLike } from '@trpc/client';
import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, useZodForm } from '@/components/ui/form';
import { SectionMessage } from '@/components/ui/section-message';

import { formatNumberToText } from '@/utils/text';

import { type AppRouter } from '@/server/api/root';

import { useCatchNavigation } from '@/hooks/use-catch-navigation';

import {
  type PublishServiceRequest,
  usePublishServiceRequest,
} from '../../stores';
import { generateHoursBetweenSevenAmAndtwentyOnePm } from '../../utils';
import { FixedFooterForm } from '../fixed-footer-form';

type StartHourProps = {
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

type StartHourType = Pick<PublishServiceRequest, 'startHour'>;

const StartHourForm = ({ error, isLoading }: StartHourProps) => {
  const router = useRouter();
  const { serviceSlug } = router.query as { serviceSlug: string };
  const { updateServiceRequest, serviceRequest } = usePublishServiceRequest();

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      startHour: serviceRequest?.startHour,
    },
  });

  const {
    control,
    formState: { isDirty, isSubmitted },
  } = form;

  const onHandleSubmit = (formData: StartHourType) => {
    updateServiceRequest(formData);
    void router.push(`/publish-service-request/${serviceSlug}/address`);
  };

  return (
    <>
      {error && <SectionMessage title={error.message} appareance="danger" />}
      <Form form={form} onSubmit={onHandleSubmit}>
        <div className="flex flex-wrap items-center gap-4">
          {generateHoursBetweenSevenAmAndtwentyOnePm().map(el => (
            <Controller
              key={el}
              control={control}
              name="startHour"
              rules={{ required: true }}
              render={({ field: { onChange, value, ...rest } }) => {
                return (
                  <Button
                    variant={value === el ? 'default' : 'outline'}
                    onClick={() => onChange(el)}
                    size="sm"
                    {...rest}
                  >
                    {formatNumberToText(el, 'hours')}
                  </Button>
                );
              }}
            />
          ))}
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

export { StartHourForm };
