import { OG_HEIGHT, OG_WIDTH } from '@/constants';
import { GenericOg, genericOgSchema } from '@/og-layouts/generic-og';
import {
  PublicProfileOg,
  publicProfileOgSchema,
} from '@/og-layouts/public-profile-og';
import {
  ServiceRequestOg,
  serviceRequestOgSchema,
} from '@/og-layouts/service-request-og';
import { ImageResponse } from '@vercel/og';
import type { NextApiRequest } from 'next';
import type { SatoriOptions } from 'satori';

import { getAbsoluteUrl } from '@/utils/routing';

export const config = {
  runtime: 'experimental-edge',
};

const interVarFont = fetch(
  new URL('../../../public/fonts/Inter-Regular.ttf', import.meta.url)
).then(res => res.arrayBuffer());

const interVarFontBold = fetch(
  new URL('../../../public/fonts/Inter-Bold.ttf', import.meta.url)
).then(res => res.arrayBuffer());

export default async function handler(req: NextApiRequest) {
  const { searchParams } = getAbsoluteUrl(req.url ?? '');
  const imageType = searchParams.get('type');

  const [interVarFontData, interVarFontBoldData] = await Promise.all([
    interVarFont,
    interVarFontBold,
  ]);

  const ogConfig = {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: [
      { name: 'Inter var', data: interVarFontData, weight: 400 },
      { name: 'Inter var', data: interVarFontBoldData, weight: 900 },
    ] as SatoriOptions['fonts'],
  };

  switch (imageType) {
    case 'serviceRequest': {
      const { title, authorAvatar, authorName, theme } =
        serviceRequestOgSchema.parse({
          title: searchParams.get('title'),
          authorAvatar: searchParams.get('authorAvatar'),
          authorName: searchParams.get('authorName'),
          theme: searchParams.get('theme'),
          imageType,
        });

      const img = new ImageResponse(
        (
          <ServiceRequestOg
            title={title}
            authorAvatar={authorAvatar}
            authorName={authorName}
            theme={theme ?? 'dark'}
          />
        ),
        ogConfig
      );

      return img;
    }

    case 'generic': {
      const { title, url, theme } = genericOgSchema.parse({
        title: searchParams.get('title'),
        url: searchParams.get('url'),
        theme: searchParams.get('theme'),
        imageType,
      });

      const img = new ImageResponse(
        <GenericOg title={title} url={url} theme={theme ?? 'dark'} />,
        ogConfig
      );

      return img;
    }

    case 'publicProfile': {
      const { title, profileName, profileAvatar, theme } =
        publicProfileOgSchema.parse({
          title: searchParams.get('title'),
          profileName: searchParams.get('profileName'),
          profileAvatar: searchParams.get('profileAvatar'),
          theme: searchParams.get('theme'),
          imageType,
        });

      const img = new ImageResponse(
        (
          <PublicProfileOg
            title={title}
            profileName={profileName}
            profileAvatar={profileAvatar}
            theme={theme ?? 'dark'}
          />
        ),
        ogConfig
      );

      return img;
    }

    default:
      return new Response("What you're looking for is not here..", {
        status: 404,
      });
  }
}
