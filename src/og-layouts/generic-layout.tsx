/* eslint-disable @typescript-eslint/ban-ts-comment */

/* eslint-disable @next/next/no-img-element */
import { APP_URL, DEFAULT_APP_TITLE } from '@/constants';
import React from 'react';
import { z } from 'zod';

import { DocsIllustration } from '@/components/ui/docs-illustration';

import { truncateOnWord } from '@/utils/text';

import { AgorasafeLogo, GradientBackground } from '@/lib/og-images';

import { type ILayout } from './types';

export const genericLayoutConfigSchema = z.object({
  title: z.string(),
  url: z.string().nullable().optional(),
  theme: z
    .preprocess(
      v => v?.toString().toLowerCase(),
      z.enum(['light', 'dark']).default('dark')
    )
    .nullable()
    .optional(),
});

export type GenericLayoutInput = z.infer<typeof genericLayoutConfigSchema>;

const Component: React.FC<{ config: GenericLayoutInput }> = ({ config }) => {
  const length = config.title.length;

  const url = (config.url ?? '').trim() === '' ? APP_URL : config.url;
  const theme = config.theme ?? 'dark';
  const title =
    (config.title ?? '').trim() === '' ? DEFAULT_APP_TITLE : config.title;

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

export const genericLayout: ILayout<typeof genericLayoutConfigSchema> = {
  name: 'generic',
  config: genericLayoutConfigSchema,
  Component,
};
