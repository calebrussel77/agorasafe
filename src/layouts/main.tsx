import { NextSeo, type NextSeoProps } from 'next-seo';
import React, { type FC, type ReactNode } from 'react';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

import { cn } from '@/lib/utils';

interface MainProps extends Omit<NextSeoProps, 'children'> {
  className?: string;
  children?: ReactNode;
  header?: ReactNode | JSX.Element;
  footer?: ReactNode | JSX.Element;
}

type Options = {
  title: string;
  description: string;
};

const MainLayout: FC<MainProps> = ({
  title,
  description,
  children,
  className,
  header = <Header />,
  footer = <Footer />,
  ...rest
}) => {
  return (
    <>
      <NextSeo title={title} description={description} {...rest} />
      <div className={cn('flex h-full min-h-screen flex-col', className)}>
        {header}
        <main className="mb-auto flex h-full flex-1 flex-col">{children}</main>
        {footer}
      </div>
    </>
  );
};

// const getLayout = (page: React.ReactElement<Options>) => {
//   return <MainLayout {...page.props}>{page}</MainLayout>;
// };

export { MainLayout };
