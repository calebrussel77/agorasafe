import { useTrackEvent } from '@/services/track';
import { Linkedin, Share } from 'lucide-react';
import React, { useEffect } from 'react';

import { QS } from '@/lib/qs';

import { useCopyText } from '@/hooks/use-copy-text';

import { TwitterXIcon } from '../icons/twitter-x-icon';
import { WhatsappIcon } from '../icons/whatsapp-icon';
import { DropdownMenu } from '../ui/dropdown-menu';
import { toast } from '../ui/toast';
import { Typography } from '../ui/typography';
import { IconCopy } from './icon-share-copy';

export function ShareButton({
  children,
  url: initialUrl,
  title,
}: {
  children: React.ReactElement;
  url?: string;
  title?: string;
}) {
  const { trackShare } = useTrackEvent();

  const url =
    typeof window === 'undefined'
      ? ''
      : !initialUrl
      ? location.href
      : `${location.protocol}//${location.host}${initialUrl}`;

  const { copy, isCopied } = useCopyText(url);

  useEffect(() => {
    if (isCopied) {
      toast({
        variant: 'success',
        title: 'Lien copié avec succès',
      });
    }
  }, [isCopied]);

  // https://web.dev/web-share/
  const shareLinks = [
    {
      type: isCopied ? 'Copié' : 'Copier le lien',
      onClick: async () => {
        await trackShare({ platform: 'clipboard', url });
        copy();
      },
      render: <IconCopy copied={!!isCopied} />,
    },
    {
      type: 'Whatsapp',
      onClick: async () => {
        await trackShare({ platform: 'whatsapp', url });
        window.open(
          `https://wa.me/send?${QS.stringify({
            text: url,
          })}`
        );
      },
      render: <WhatsappIcon className="h-[18px] w-[18px] text-gray-600" />,
    },
    {
      type: 'LinkedIn',
      onClick: async () => {
        await trackShare({ platform: 'linkedIn', url });
        window.open(
          `https://linkedin.com/shareArticle?${QS.stringify({
            url,
            title,
          })}`
        );
      },
      render: <Linkedin className="h-5 w-5 text-gray-600" />,
    },
    {
      type: 'X (Twitter)',
      onClick: async () => {
        await trackShare({ platform: 'twitter', url });
        window.open(
          `https://twitter.com/intent/tweet?${QS.stringify({
            url,
            text: title,
            via: 'agorasafe',
          })}`
        );
      },
      render: <TwitterXIcon className="h-5 w-5 text-gray-600" />,
    },
    {
      type: 'Autres',
      onClick: () => void navigator.share({ url, title }),
      render: <Share className="h-5 w-5 text-gray-600" />,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[270px]">
        <Typography as="h3" className="ml-2 mt-2">
          Partager
        </Typography>
        <div className="mt-4 flex flex-col space-y-1">
          {shareLinks.map(({ type, onClick, render }) => (
            <DropdownMenu.Item
              key={type}
              className="default__transition flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-gray-900 hover:bg-gray-100"
              onClick={onClick}
            >
              {render}
              {type}
            </DropdownMenu.Item>
          ))}
        </div>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
