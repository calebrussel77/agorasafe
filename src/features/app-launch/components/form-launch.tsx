import { type FC } from 'react';

import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SectionMessage } from '@/components/ui/section-message';
import { Tabs } from '@/components/ui/tabs';

interface FormLaunchProps {
  formId: string;
  onSubmit: (data: { email: string; name: string }) => void;
}
const FormLaunch: FC<FormLaunchProps> = ({ onSubmit, formId }) => {
  const form = useZodForm({});

  const { register } = form;

  return (
    <>
      <Tabs defaultValue="email" className="w-full">
        <Tabs.List className="mx-auto grid w-[300px] grid-cols-2">
          <Tabs.Trigger value="email">Adresse email</Tabs.Trigger>
          <Tabs.Trigger value="whatsapp">Whatsapp</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="email" className="mt-8">
          <Form form={form} onSubmit={onSubmit} id={formId}>
            <div className="grid grid-cols-2 gap-3">
              <Field required aria-label="Nom" label="Nom">
                <Input placeholder="Entrez votre nom" {...register('name')} />
              </Field>
              <Field required aria-label="Adresse email" label="Adresse email">
                <Input
                  placeholder="Entrez votre adresse email"
                  {...register('email')}
                />
              </Field>
            </div>
          </Form>
        </Tabs.Content>
        <Tabs.Content value="whatsapp" className="mt-8">
          <Form form={form} onSubmit={onSubmit} id={formId}>
            <div className="grid grid-cols-2 gap-3">
              <Field required aria-label="Nom" label="Nom">
                <Input placeholder="Entrez votre nom" {...register('name')} />
              </Field>
              <Field
                required
                aria-label="Numéro whatsapp"
                label="Numéro whatsapp"
              >
                <Input
                  placeholder="Entrez votre numéro whatsapp"
                  {...register('email')}
                />
              </Field>
            </div>
          </Form>
        </Tabs.Content>
        <SectionMessage
          className="mt-3"
          description={
            <p className="text-sm font-normal text-white">
              Nous protégeons vos données et ne vous enverrons que des
              informations liées au lancement. Rejoignez-nous !
            </p>
          }
          hasCloseButton={false}
          appareance="info"
        />
      </Tabs>
    </>
  );
};

export { FormLaunch };
