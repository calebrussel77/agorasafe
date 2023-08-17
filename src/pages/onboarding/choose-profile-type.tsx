/* eslint-disable @next/next/no-img-element */
import { type GetServerSideProps } from 'next';
import { type Session } from 'next-auth';
import { useSession } from 'next-auth/react';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { GroupItem } from '@/components/ui/group-item';
import { CenterContent } from '@/components/ui/layout';

import { ChooseProfileTypeForm } from '@/features/auth-onboarding';

import { requireAuth } from '@/utils/require-auth';

const ChooseAccountTypePage = () => {
  const { data: session } = useSession();
  return (
    <CenterContent className="container min-h-screen max-w-2xl w-full">
      <Card>
        <Card.Header>
          <Card.Title className="text-xl">
            Avec quel type de profil souhaitez-vous interagir ?
          </Card.Title>
          <div className="mx-auto">
            <GroupItem
              iconBefore={
                <Avatar
                  title={session?.user?.name}
                  src={session?.user?.avatar}
                />
              }
              name={session?.user?.name as never}
              description={session?.user?.email}
              classNames={{
                root: 'rounded-full bg-gray-100 py-1 text-sm',
                name: 'text-sm',
              }}
            />
          </div>
        </Card.Header>
        <Card.Content>
          <ChooseProfileTypeForm />
        </Card.Content>
      </Card>
    </CenterContent>
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

export default ChooseAccountTypePage;
