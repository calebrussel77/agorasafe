import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, useZodForm } from '@/components/ui/form';

import { formatNumberToText } from '@/utils/text';

import {
  type PublishServiceRequestFormStore,
  usePublishServiceRequest,
} from '../../stores';
import { generateHoursBetweenSevenAmAndtwentyOnePm } from '../../utils';
import { FixedFooterForm } from '../fixed-footer-form';

type StartHourType = Pick<PublishServiceRequestFormStore, 'startHour'>;

type StartHourFormProps = { nextStep: () => void; prevStep: () => void };

const StartHourForm = ({ nextStep, prevStep }: StartHourFormProps) => {
  const { query } = useRouter();
  const categorySlugQuery = query.category as string;

  const { updateServiceRequest, serviceRequest: _serviceRequest } =
    usePublishServiceRequest();

  const serviceRequest = _serviceRequest?.[categorySlugQuery];

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      startHour:
        serviceRequest?.startHour ||
        generateHoursBetweenSevenAmAndtwentyOnePm()[2],
    },
  });

  const { control } = form;

  const onHandleSubmit = (formData: StartHourType) => {
    updateServiceRequest(formData, categorySlugQuery);
    nextStep();
  };

  return (
    <>
      <Form form={form} onSubmit={onHandleSubmit}>
        <div className="flex flex-wrap items-center gap-4">
          {generateHoursBetweenSevenAmAndtwentyOnePm().map(el => (
            <Controller
              key={el}
              control={control}
              name="startHour"
              rules={{
                required: "L'heure de début de la prestation est requise.",
              }}
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
          <Button type="button" onClick={prevStep} variant="ghost" size="lg">
            Retour
          </Button>
          <Button size="lg">Suivant</Button>
        </FixedFooterForm>
      </Form>
    </>
  );
};

export { StartHourForm };
