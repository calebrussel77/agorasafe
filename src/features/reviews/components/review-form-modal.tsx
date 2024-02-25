import { getSanitizedStringSchema, rsOptionSchema } from '@/validations';
import { MapPinIcon } from 'lucide-react';
import React, { type PropsWithChildren } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useDialogContext } from '@/components/ui/dialog/dialog-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { GroupItem } from '@/components/ui/group-item';
import { Inline } from '@/components/ui/inline';
import { CenterContent } from '@/components/ui/layout';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { ModalHeader, ModalMain } from '@/components/ui/modal';
import { Rating } from '@/components/ui/rating';
import { Editor } from '@/components/ui/rich-text-editor';
import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Typography } from '@/components/ui/typography';
import { VariantMessage } from '@/components/ui/variant-message';

import { api } from '@/utils/api';

import { useIsMobile } from '@/hooks/use-breakpoints';

const reviewFormSchema = z.object({
  content: getSanitizedStringSchema(),
  rating: z.number({ required_error: 'Veuillez sélectionner une note.' }),
  serviceRequestId: rsOptionSchema,
});

export type ReviewFormInput = z.infer<typeof reviewFormSchema>;

interface ReviewFormModalProps {
  profileName: string | null;
  profileAvatar: string | null;
  profileId: string;
  rating: number;
  reviewId?: string;
}

const ReviewFormModal = ({
  reviewId,
  profileAvatar,
  profileId,
  profileName,
  rating: initialRating,
}: PropsWithChildren<ReviewFormModalProps>) => {
  const dialog = useDialogContext();
  const queryUtils = api.useContext();
  const isMobile = useIsMobile();

  const {
    isInitialLoading: isLoadingServiceRequestReservation,
    data: serviceRequestReservationsData,
  } = api.profiles.getServiceRequestReservations.useQuery(
    {
      providerProfileId: profileId,
    },
    { enabled: !!profileId }
  );

  const form = useZodForm({
    schema: reviewFormSchema,
    defaultValues: {
      rating: initialRating === 0 ? undefined : initialRating,
    },
  });

  const { control } = form;

  const hasCommonProjects =
    serviceRequestReservationsData &&
    serviceRequestReservationsData?.length > 0;

  const onHandleSubmit = (formData: ReviewFormInput) => {
    if (!profileId || !profileName || !formData.rating) return;
    console.log({ formData });

    // form.reset();
  };

  return (
    <Modal
      open={dialog.opened}
      isFullScreen={isMobile}
      onOpenChange={dialog.handleClose}
      style={{ zIndex: dialog.zIndex }}
      closeOnClickOutside={profileId ? false : true}
    >
      <ModalHeader
        title={
          <div className="flex items-center gap-3">
            <Avatar
              size="md"
              src={profileAvatar || ''}
              alt={profileName || ''}
            />
            <div>
              <Typography as="h4">{profileName}</Typography>
              <Typography variant="small" className="font-normal">
                {!reviewId ? 'Ajouter une note à ' : 'Modifier la note de '}
                ce prestataire
              </Typography>
            </div>
          </div>
        }
      />
      <ModalMain className="relative">
        {isLoadingServiceRequestReservation ? (
          <CenterContent className="my-16">
            <Spinner variant="primary" />
          </CenterContent>
        ) : hasCommonProjects ? (
          <Form form={form} className="gap-6" onSubmit={onHandleSubmit}>
            <Controller
              control={control}
              name="rating"
              render={({ field, fieldState }) => {
                return (
                  <div className="mx-auto flex flex-col justify-center">
                    <Rating
                      onChange={field.onChange}
                      initialRating={field.value}
                      size="xxl"
                    />
                    {fieldState?.error && (
                      <VariantMessage variant="danger" className="mt-1">
                        {fieldState?.error?.message}
                      </VariantMessage>
                    )}
                  </div>
                );
              }}
            />

            <Field
              label="Demande de service sur laquelle vous avez collaboré"
              required
            >
              <Controller
                name="serviceRequestId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    isLoading={isLoadingServiceRequestReservation}
                    placeholder="Choisissez le projet..."
                    variant={error ? 'danger' : undefined}
                    autoFocus
                    onChange={field.onChange}
                    value={field.value as never}
                    formatOptionLabel={(
                      _data: unknown,
                      formatOptionLabelMeta: { context: string }
                    ) => {
                      const data = _data as {
                        label: string;
                        datePeriodFormattedText: string;
                        location: string;
                      };
                      const isMenuCtx =
                        formatOptionLabelMeta?.context === 'menu';
                      if (isMenuCtx) {
                        return (
                          <GroupItem
                            name={
                              <Inline>
                                <Typography as="p" className="font-semibold">
                                  {data?.label}
                                </Typography>
                                <Typography
                                  variant="small"
                                  className="text-inherit"
                                >
                                  {data?.datePeriodFormattedText}
                                </Typography>
                              </Inline>
                            }
                            isHoverDisabled
                            description={
                              <div className="flex items-center gap-2">
                                <MapPinIcon className="h-4 w-4" />
                                <Typography variant="small">
                                  {data?.location}
                                </Typography>
                              </div>
                            }
                          />
                        );
                      }
                      return (
                        <span className="max-w-[270px] truncate rounded-full bg-brand-500 p-2 text-sm text-white">
                          {data?.label} - {data?.location}
                        </span>
                      );
                    }}
                    options={serviceRequestReservationsData?.map(el => ({
                      value: el.serviceRequest?.id,
                      label: el.serviceRequest?.title,
                      location: el.serviceRequest?.location?.address,
                      datePeriodFormattedText:
                        el.serviceRequest?.datePeriodFormattedText,
                    }))}
                  />
                )}
              />
            </Field>
            <Controller
              control={control}
              name="content"
              render={({ field: { onChange, value }, fieldState }) => {
                return (
                  <Editor
                    label="Détails (facultatif)"
                    placeholder={`Que pensez-vous de ${profileName} ?`}
                    error={fieldState?.error?.message}
                    editorSize="md"
                    onChange={onChange}
                  />
                );
              }}
            />
          </Form>
        ) : (
          <EmptyState
            className="my-16"
            name="Aucune collaboration trouvée"
            description="Vous ne pouvez noter que les prestataires avec qui vous avez collaboré sur une demande."
          />
        )}
      </ModalMain>
      {hasCommonProjects && (
        <ModalFooter>
          <Button type="button" variant="outline" onClick={dialog.handleClose}>
            Annuler
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onHandleSubmit)}>
            Envoyer
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
};

export { ReviewFormModal };
