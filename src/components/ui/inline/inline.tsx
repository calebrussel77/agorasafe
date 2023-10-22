import { Children, Fragment, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Example
 *  <Inline
      divider={<span className="text-brand-600">·</span>}
      divider={<span aria-hidden="true">&middot;</span>}
      className="gap-1"
    >
      {actions}
    </Inline>
 */

/**
 *  
 *  char   description          unicode   html       html entity    utf-8

    ·      Middle Dot           U+00B7    &#183;     &middot;       C2 B7
    ·      Greek Ano Teleia     U+0387    &#903;                    CE 87
    •      Bullet               U+2022    &#8226;    &bull;         E2 80 A2
    ‧      Hyphenation Point    U+2027    &#8321;                   E2 80 A7
    ∙      Bullet Operator      U+2219    &#8729;                   E2 88 99
    •      Bullet               U+2022    &#8226;    &bull;         E2 80 A2
    ●      Black Circle         U+25CF    &#9679;                   E2 97 8F
    ⬤     Black Large Circle   U+2B24    &#11044;                  E2 AC A4
* 
*/

type InlineProps = {
  divider?: ReactNode;
  className?: string;
  children?: ReactNode;
};

const Inline = ({ divider = '·', className, children }: InlineProps) => {
  const nonNullishChildren = Children.toArray(children).filter(Boolean);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {nonNullishChildren.map((child, index) => (
        <Fragment key={index}>
          {index > 0 ? <span>{divider}</span> : null}
          {typeof child === 'string' ? (
            <span className="line-clamp-1 flex-nowrap whitespace-nowrap">
              {child}
            </span>
          ) : (
            child
          )}
        </Fragment>
      ))}
    </div>
  );
};

Inline.displayName = 'Inline';

export { Inline };
