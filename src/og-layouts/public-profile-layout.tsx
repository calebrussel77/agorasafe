/* eslint-disable @next/next/no-img-element */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { APP_URL } from '@/constants';
import React from 'react';
import { z } from 'zod';

import { DocsIllustration } from '@/components/ui/docs-illustration';

import { extractDomainName } from '@/utils/strings';
import { truncateOnWord } from '@/utils/text';

import { AgorasafeLogo, GradientBackground } from '@/lib/og-images';

import { ILayout } from './types';

export const publicProfileLayoutConfigSchema = z.object({
  title: z.string(),
  profileName: z.string(),
  profileAvatar: z.string(),
  theme: z
    .preprocess(
      v => v?.toString().toLowerCase(),
      z.enum(['light', 'dark']).default('dark')
    )
    .nullable()
    .optional(),
});

export type PublicProfileLayoutConfigInput = z.infer<
  typeof publicProfileLayoutConfigSchema
>;

const Component: React.FC<{ config: PublicProfileLayoutConfigInput }> = ({
  config,
}) => {
  const length = config.title.length;
  const url = extractDomainName(APP_URL);
  const theme = config.theme ?? 'dark';

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
        <span
          tw="p-2 text-base items-center flex justify-center rounded-full my-2"
          style={{
            maxWidth: 180,
            backgroundColor: '#dfe7fa',
            color: '#354cd0',
          }}
        >
          Profil Publique
        </span>
        <p
          tw="font-bold"
          style={{ lineHeight: 1.4, fontSize: length > 50 ? 48 : 60 }}
        >
          {truncateOnWord(config.title, 120)}
        </p>

        <div tw="flex items-center mt-6">
          <img
            src={config.profileAvatar}
            alt={config.profileName}
            style={{
              borderRadius: '100%',
              width: 56,
              height: 56,
              boxShadow: '0 0 0 3px #E5E7EB, 12px',
            }}
          />
          <p tw="text-3xl opacity-60 ml-7">
            {truncateOnWord(config.profileName, 90)}
          </p>
        </div>
      </div>

      <p
        tw="absolute right-10 bottom-4 text-xl"
        style={{ color: 'hsl(270, 70%, 65%)' }}
      >
        {url}
      </p>
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

export const publicProfileLayout: ILayout<
  typeof publicProfileLayoutConfigSchema
> = {
  name: 'public-profile',
  config: publicProfileLayoutConfigSchema,
  Component,
};
