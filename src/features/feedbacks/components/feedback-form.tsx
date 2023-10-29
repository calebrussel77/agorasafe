import { FeedbackType } from '@prisma/client';
import { Camera } from 'lucide-react';
import React, { type FC } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { DropzoneUpload } from '@/components/ui/uploadthing';

const feedBackFormSchema = z.object({
  type: z.nativeEnum(FeedbackType),
  content: z.string().min(1, 'Veuillez saisir un commentaire.'),
  image: z.array(z.unknown()).optional(),
});
export type FeedBackFormInput = z.infer<typeof feedBackFormSchema>;

interface FeedbackFormProps {
  id: string;
  onSubmit: (data: FeedBackFormInput) => Promise<void>;
}

const FeedbackForm: FC<FeedbackFormProps> = ({ id, onSubmit }) => {
  const form = useZodForm({
    schema: feedBackFormSchema,
    defaultValues: {
      image: [],
    },
  });

  const { control } = form;

  const onHandleSubmit = async (formData: FeedBackFormInput) => {
    await onSubmit(formData);
    // form.reset();
  };

  return (
    <Form form={form} onSubmit={onHandleSubmit} id={id}>
      <Field label="Votre commentaire" required>
        <Textarea
          {...form.register('content')}
          placeholder={`Ajouter votre commentaire...`}
        />
      </Field>
      <Field label="Type" required>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <RadioGroup
              required
              onValueChange={field.onChange}
              value={field.value}
              className="mt-1 flex flex-wrap items-center gap-3"
            >
              <div className="flex items-center gap-x-2">
                <RadioGroup.Item
                  aria-label={`Bugs`}
                  value={FeedbackType.Bug}
                  id="bugs"
                />
                <Label className="Label" htmlFor="bugs">
                  Bugs (Problèmes techniques)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroup.Item
                  aria-label="Suggestions"
                  value={FeedbackType.Suggestion}
                  id="suggestions"
                />
                <Label className="Label" htmlFor="suggestions">
                  Suggestions
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroup.Item
                  aria-label="Others"
                  value={FeedbackType.Other}
                  id="others"
                />
                <Label className="Label" htmlFor="others">
                  Autres
                </Label>
              </div>
            </RadioGroup>
          )}
        />
      </Field>
      <Controller
        control={control}
        name="image"
        render={({ field: { onChange, value }, fieldState }) => {
          const fileValue = value as File[];
          return (
            <DropzoneUpload
              hint="Le poids max. d'un fichier est de 4MB"
              error={fieldState?.error?.message}
              icon={<Camera className="h-10 w-10 text-zinc-600" />}
              className="h-[200px] sm:h-[130px]"
              label="Ajouter une capture d'ecran (Optionnel)..."
              value={fileValue}
              onChange={onChange}
            />
          );
        }}
      />
    </Form>
  );
};

export { FeedbackForm };
