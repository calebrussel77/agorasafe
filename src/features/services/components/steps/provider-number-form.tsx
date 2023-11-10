import { useRouter } from 'next/router';

import { FixedFooterContainer } from '@/components/fixed-footer-container';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import {
  type PublishServiceRequestFormStore,
  usePublishServiceRequest,
} from '../../stores';

type Address = Pick<PublishServiceRequestFormStore, 'numberOfProviderNeeded'>;
type ProviderNumberFormProps = { nextStep: () => void; prevStep: () => void };

const ProviderNumberForm = ({
  nextStep,
  prevStep,
}: ProviderNumberFormProps) => {
  const { query } = useRouter();
  const categorySlugQuery = query.category as string;

  const { updateServiceRequest, serviceRequest: _serviceRequest } =
    usePublishServiceRequest();
  const serviceRequest = _serviceRequest?.[categorySlugQuery];

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      numberOfProviderNeeded: serviceRequest?.numberOfProviderNeeded || 1,
    },
  });

  const { register } = form;

  const onHandleSubmit = (formData: Address) => {
    updateServiceRequest(formData, categorySlugQuery);
    nextStep();
  };

  return (
    <>
      <Form form={form} onSubmit={onHandleSubmit}>
        <Field label="Nombre de prestataires" required>
          <Input
            {...register('numberOfProviderNeeded', {
              min: {
                value: 1,
                message: 'Le nombre de prestataires minimum est de 01',
              },
            })}
            type="number"
            placeholder="Entrez le nombre de personnes dont vous avez besoin..."
          />
        </Field>
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

export { ProviderNumberForm };
