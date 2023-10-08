import { Typography } from '@/components/ui/typography';

const ConversationChatWelcome = ({
  name,
}: React.PropsWithChildren<{
  name?: string;
}>) => {
  return (
    <div className="mb-4 space-y-2 px-4">
      <Typography as="h3" className="text-3xl font-bold">
        {name}
      </Typography>
      <Typography variant="subtle">{`Ceci est le début de votre conversation avec ${name}`}</Typography>
    </div>
  );
};

export { ConversationChatWelcome };
