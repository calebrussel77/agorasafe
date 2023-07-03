import { MainLayout } from '@/layouts';
import { useProfileStore } from '@/stores/profiles';
import { ProfileType } from '@prisma/client';
import { MoveLeft } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { type Session } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { Redirect } from '@/components/redirect';
import { Card } from '@/components/ui/card';
import { Notification } from '@/components/ui/notification';

import {
  AddProfileForm,
  type AddProfileFormData,
  useCreateProfile,
} from '@/features/profiles';

import { wait } from '@/utils/misc';
import { getProfileType } from '@/utils/profile';
import { requireAuth } from '@/utils/require-auth';

const ALLOWED_TYPES = Object.keys(ProfileType);

const AddNewProfilePage = () => {
  const router = useRouter();
  const { profile_type } = router.query;

  const profileStore = useProfileStore();

  const { mutate, error, isLoading } = useCreateProfile({
    onSuccess(data) {
      toast(<Notification variant="success" title={data.message} />, {
        autoClose: false,
      });
      useProfileStore.persist.clearStorage();
      wait(3_00)
        .then(() => {
          void router.replace('/');
        })
        .catch(e => console.log(e));
    },
  });

  const onRegister = (data: AddProfileFormData) => {
    mutate({
      ...data,
    });
  };

  if (router.isReady && !ALLOWED_TYPES.includes(profile_type as ProfileType)) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container flex min-h-screen w-full max-w-xl flex-col items-center justify-center">
      <div>
        <Link href="/" className="mb-6 flex items-center gap-2">
          <MoveLeft className="h-5 w-5" />
          <span>Retour</span>
        </Link>
        <Card>
          <Card.Header>
            <Card.Title className="text-xl">
              Ajouter un profile{' '}
              {getProfileType(profile_type as ProfileType).toLowerCase()}
            </Card.Title>
            <Card.Description>
              Renseignez les informations ci-dessous pour facilement gérer vos
              projets, consulter vos candidatures, rechercher des prestataires
              ou des demandes de service, etc.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <AddProfileForm
              onSubmit={onRegister}
              error={error}
              isLoading={isLoading}
              selectedProfile={profile_type as ProfileType}
            />
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  session: Session;
}> = async ctx => {
  return requireAuth({
    ctx,
    cb({ session }) {
      return {
        props: { session },
      };
    },
  });
};

export default AddNewProfilePage;
