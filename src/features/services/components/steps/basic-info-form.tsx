import { useSearchParams } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import { usePublishServiceRequest } from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

const firstSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Renseignez un titre beaucoup plus parlant.')
    .max(300, 'Le titre doit avoir au maximum 300 charactères.'),
  description: z
    .string()
    .trim()
    .min(5, 'Renseignez une description beaucoup plus explicite.'),
  willWantProposal: z.literal(true),
});

const secondSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Renseignez un titre beaucoup plus parlant.')
    .max(300, 'Le titre doit avoir au maximum 300 charactères.'),
  description: z
    .string()
    .trim()
    .min(5, 'Renseignez une description beaucoup plus explicite.'),
  estimatedPrice: z.coerce
    .number()
    .min(200, 'Le prix doit être supérieur à 200 FCFA.'),
  willWantProposal: z.literal(false),
});

const basicInfoFormSchema = z.discriminatedUnion('willWantProposal', [
  firstSchema,
  secondSchema,
]);

type BasicInfoFormData = z.infer<typeof basicInfoFormSchema>;

type BasicInfoFormProps = { nextStep: () => void };

const BasicInfoForm = ({ nextStep }: BasicInfoFormProps) => {
  const searchParams = useSearchParams();
  const categorySlugQuery = searchParams.get('category') || '';
  const titleQuery = searchParams.get('title') || '';
  const modeQuery = searchParams.get('mode') as 'normal' | 'custom';

  const { updateServiceRequest, serviceRequest: _serviceRequest } =
    usePublishServiceRequest();
  const serviceRequest = _serviceRequest?.[categorySlugQuery];

  const isNormal = modeQuery === 'normal';

  const form = useZodForm({
    schema: basicInfoFormSchema,
    defaultValues: {
      title: titleQuery || serviceRequest?.title,
      description: serviceRequest?.description,
      willWantProposal: (serviceRequest?.willWantProposal as never) || true,
      estimatedPrice: serviceRequest?.estimatedPrice,
    },
  });

  const { register, watch, control, clearErrors } = form;

  const willWantProposalWatch = watch('willWantProposal');

  const onHandleSubmit = (formData: BasicInfoFormData) => {
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
        {!willWantProposalWatch && (
          <Field label="Prix estimé (CFA)" required>
            <Input
              {...register('estimatedPrice')}
              type="number"
              placeholder="Entrez le prix de que vous êtes prêts à payer pour ce besoin..."
            />
          </Field>
        )}
        <Controller
          control={control}
          name="willWantProposal"
          render={({ field: { ref, onChange, value } }) => (
            <Field label="Je souhaite qu'on me fasse des propositions sur le prix.">
              <Switch
                onClick={() => clearErrors('estimatedPrice')}
                checked={value}
                onCheckedChange={onChange}
              />
            </Field>
          )}
        />

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
