import { type Element, attributesToProps } from 'html-react-parser';
import { useMemo } from 'react';

import { htmlParse, needsColorSwap } from '@/lib/html-helper';
import { cn } from '@/lib/utils';

import { Truncate, type TruncateProps } from '../ui/truncate';

type Props =
  | ({
      truncate: true;
      html: string;
      withMentions?: boolean;
      className?: string;
    } & TruncateProps)
  | {
      truncate: false;
      html: string;
      withMentions?: boolean;
      className?: string;
    };

export function RenderHtml({
  html,
  truncate,
  withMentions = false,
  className,
  ...props
}: Props) {
  const _html = useMemo(
    () =>
      htmlParse(html, {
        replace(domNode) {
          const { attribs, tagName, children } = domNode as Element;

          if (!attribs) {
            return;
          }

          console.log({ children });

          if (attribs && tagName === 'span') {
            const props = attributesToProps(attribs);
            const dataType = attribs['data-type'];
            const isMention = dataType === 'mention';
            const style = attribs['style'];
            const hexColor = style?.match(/color:#([0-9a-f]{6})/)?.[1];
            const isNeedsSwap = hexColor
              ? needsColorSwap({
                  hexColor,
                  colorScheme: 'light',
                  threshold: 0.2,
                })
              : false;

            return withMentions && isMention ? (
              <a
                {...props}
                href={`/u/${attribs['data-label'] ?? attribs['data-id']}`}
              />
            ) : (
              <span {...props} />
            );
          }
        },
      }),
    [html, withMentions]
  );

  const containerClassName = cn(
    'prose prose-sm max-w-none text-base text-inherit prose-h1:m-0 prose-h2:m-0 hover:prose-a:underline prose-h3:m-0 prose-p:m-0 prose-a:font-bold prose-a:text-brand-500 prose-a:no-underline prose-blockquote:m-0 prose-img:m-0',
    className
  );

  if (truncate)
    return (
      <div className={containerClassName}>
        <Truncate lines={3} hasEllipsisText {...props}>
          {_html}
        </Truncate>
      </div>
    );

  return <div className={containerClassName}>{_html}</div>;
}
