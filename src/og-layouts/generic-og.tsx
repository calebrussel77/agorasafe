/* eslint-disable @typescript-eslint/ban-ts-comment */

/* eslint-disable @next/next/no-img-element */
import { APP_URL, DEFAULT_APP_TITLE } from '@/constants';
import React, { type PropsWithChildren } from 'react';
import { z } from 'zod';

import { DocsIllustration } from '@/components/ui/docs-illustration';

import { truncateOnWord } from '@/utils/text';

import { AgorasafeLogo, GradientBackground } from '@/lib/og-images';

export const genericOgSchema = z.object({
  imageType: z.literal('generic'),
  title: z.string(),
  url: z.string().nullable().optional(),
  theme: z.enum(['light', 'dark']).default('light').nullable().optional(),
});

export type GenericOgInput = Omit<z.infer<typeof genericOgSchema>, 'imageType'>;

const GenericOg = ({
  url: appUrl,
  title: appTitle,
  theme = 'dark',
}: PropsWithChildren<GenericOgInput>) => {
  const url = (appUrl ?? '').trim() === '' ? APP_URL : appUrl;
  const title = (appTitle ?? '').trim() === '' ? DEFAULT_APP_TITLE : appTitle;
  const length = title.length;

  return (
    <div tw="relative flex justify-start items-end w-full h-full">
      {/* gradient layers */}
      <GradientBackground theme={theme} />
      {/* main text */}
      <div
        tw="flex flex-col text-left"
        style={{
          color: theme === 'light' ? `#1f224c` : '#f1f4fd',
          maxWidth: 740,
          marginLeft: 96,
          marginBottom: 80,
        }}
      >
        <p
          tw="font-bold"
          style={{ lineHeight: 1.4, fontSize: length > 50 ? 48 : 60 }}
        >
          {truncateOnWord(title, 120)}
        </p>
      </div>

      <p
        tw="absolute right-10 bottom-4 text-xl"
        style={{ color: 'hsl(270, 70%, 65%)' }}
      >
        {url}
      </p>

      {/* agorasafe logo */}
      <AgorasafeLogo
        /* @ts-ignore */
        tw="absolute"
        style={{ top: 106, right: 97 }}
        theme={theme}
      />
      <div tw="absolute top-0 right-0 flex">
        <DocsIllustration />
      </div>
    </div>
  );
};

export { GenericOg };
