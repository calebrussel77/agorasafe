import { OG_HEIGHT, OG_WIDTH } from '@/constants';
import { getLayoutAndConfig } from '@/og-layouts';
import { type ILayout, type ILayoutConfig } from '@/og-layouts/types';
import fs from 'fs';
import type { NextApiHandler } from 'next';
import { type SatoriOptions } from 'satori';
import satori from 'satori';
import { z } from 'zod';

import { sanitizeHTML } from '@/lib/html-helper';

const imageReq = z.object({
  layoutName: z.string(),
});

const fonts: SatoriOptions['fonts'] = [
  {
    name: 'Inter',
    style: 'normal',
    weight: 400,
    data: fs.readFileSync('public/fonts/Inter-Regular.ttf'),
  },
  {
    name: 'Inter',
    style: 'bold' as never,
    weight: 800,
    data: fs.readFileSync('public/fonts/Inter-Bold.ttf'),
  },
];

export const renderLayoutToSVG = async ({
  layout,
  config,
}: {
  layout: ILayout;
  config: ILayoutConfig;
}) => {
  const Component = layout.Component;

  const svg = await satori(<Component config={config} />, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  });

  return svg;
};

const handler: NextApiHandler = async (req, res) => {
  try {
    const { layoutName } = await imageReq.parseAsync(req.query);

    const { layout, config } = await getLayoutAndConfig(
      layoutName.toLowerCase(),
      req.query
    );
    const view = await renderLayoutToSVG({ layout, config });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    );
    res.end(view);
  } catch (e) {
    res.statusCode = 500;
    const error = e as Error;
    res.setHeader('Content-Type', 'text/html');
    res.end(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `<h1>Internal Error</h1><pre><code>${sanitizeHTML(
        error.message
      )}</code></pre>`
    );
    console.error(e);
  }
};

export default handler;
