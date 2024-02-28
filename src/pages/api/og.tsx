/* eslint-disable @typescript-eslint/ban-ts-comment */

/* eslint-disable @typescript-eslint/require-await */

/* eslint-disable testing-library/render-result-naming-convention */
import { OG_HEIGHT, OG_WIDTH } from '@/constants';
import { getLayoutAndConfig } from '@/og-layouts';
import { type ILayout, type ILayoutConfig } from '@/og-layouts/types';
import { Resvg, type ResvgRenderOptions } from '@resvg/resvg-js';
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

const resvgOpts: ResvgRenderOptions = {
  fitTo: {
    mode: 'width',
    value: OG_WIDTH,
  },
  shapeRendering: 2,
  textRendering: 2,
  imageRendering: 0,
};

export const renderSVGToPNG = async (svg: string) => {
  const resvg = new Resvg(svg, resvgOpts);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
};

const handler: NextApiHandler = async (req, res) => {
  try {
    const { layoutName } = await imageReq.parseAsync(req.query);

    const { layout, config } = await getLayoutAndConfig(
      layoutName.toLowerCase(),
      req.query
    );

    const svg = await renderLayoutToSVG({ layout, config });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    );

    const png = await renderSVGToPNG(svg);
    res.end(png);
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
