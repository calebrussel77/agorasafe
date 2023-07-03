import { NextSeo, type NextSeoProps } from 'next-seo';
import React, { type FC } from 'react';

const Seo: FC<NextSeoProps> = ({ ...props }) => {
  return <NextSeo {...props} />;
};

export { Seo, NextSeoProps as SeoProps };
