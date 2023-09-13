import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  type PublishServiceRequestFormStore,
  usePublishServiceRequest,
} from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

type BasicInfo = Pick<PublishServiceRequestFormStore, 'title' | 'description'>;

type BasicInfoFormProps = { nextStep: () => void };

const BasicInfoForm = ({ nextStep }: BasicInfoFormProps) => {
  const router = useRouter();
  const categorySlugQuery = router?.query?.category as string;
  const titleQuery = router?.query?.title as string;
  const modeQuery = router?.query?.mode as 'normal' | 'custom';

  const { updateServiceRequest, serviceRequest: _serviceRequest } =
    usePublishServiceRequest();
  const serviceRequest = _serviceRequest?.[categorySlugQuery];

  const isNormal = modeQuery === 'normal';

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      title: titleQuery || serviceRequest?.title,
      description: serviceRequest?.description,
    },
  });

  const { register } = form;

  const onHandleSubmit = (formData: BasicInfo) => {
    updateServiceRequest(formData, categorySlugQuery);

    nextStep();
  };

  return (
    <>
      <Form form={form} onSubmit={onHandleSubmit}>
        <Field label="Titre de la demande" required>
          <Input
            {...register('title')}
            placeholder="Entrez le titre de votre demande"
          />
        </Field>
        <Field
          hint="TIPS: Une description claire et précise facilitera la compréhension des prestataires à contracter."
          label={
            isNormal ? 'Détails supplémentaires' : 'Description de la demande'
          }
          required
        >
          <Textarea
            {...register('description')}
            rows={8}
            cols={8}
            placeholder="Entrez la description de votre demande"
          />
        </Field>
        <FixedFooterForm>
          <Button size="lg">Suivant</Button>
        </FixedFooterForm>
      </Form>
    </>
  );
};

export { BasicInfoForm };
