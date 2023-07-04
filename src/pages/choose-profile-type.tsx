/* eslint-disable @next/next/no-img-element */
import { type GetServerSideProps } from 'next';
import { type Session } from 'next-auth';
import { useSession } from 'next-auth/react';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { GroupItem } from '@/components/ui/group-item';

import { ChooseProfileTypeForm } from '@/features/auth-onboarding';

import { requireAuth } from '@/utils/require-auth';

const ChooseAccountTypePage = () => {
  const { data: session } = useSession();
  return (
    <div className="container flex min-h-screen w-full max-w-[590px] flex-col items-center justify-center">
      <Card>
        <Card.Header>
          <Card.Title className="text-xl">
            Avec quel type de profile souhaitez-vous interagir ?
          </Card.Title>
          <div className="mx-auto">
            <GroupItem
              className="bg-gray-100 text-sm rounded-full py-1"
              titleClassName="text-sm"
              iconBefore={
                <Avatar
                  title={session?.user?.name}
                  src={session?.user?.avatar}
                />
              }
              title={session?.user?.name as never}
            >
              {session?.user?.email}
            </GroupItem>
          </div>
        </Card.Header>
        <Card.Content>
          <ChooseProfileTypeForm />
        </Card.Content>
      </Card>
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

export default ChooseAccountTypePage;
