import React, { type FC, type ReactNode } from 'react';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { PageTransition } from '@/components/page-transition';
import { Seo, type SeoProps } from '@/components/ui/seo';

import { cn } from '@/lib/utils';

interface MainProps extends Omit<SeoProps, 'children'> {
  className?: string;
  children?: ReactNode;
  header?: ReactNode | JSX.Element;
  footer?: ReactNode | JSX.Element;
}

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
      <Seo title={title} description={description} {...rest} />
      <div className={cn('flex h-full min-h-screen flex-col', className)}>
        {header}
        <div className="mb-auto flex h-full flex-1 flex-col">{children}</div>
        {footer}
      </div>
    </>
  );
};

const getLayout = (page: React.ReactElement<SeoProps & unknown>) => {
  return <MainLayout {...page.props}>{page}</MainLayout>;
};

export { MainLayout, getLayout as getMainLayout };
