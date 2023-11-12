import { type Element, attributesToProps } from 'html-react-parser';
import { useMemo } from 'react';

import { htmlParse, needsColorSwap } from '@/lib/html-helper';
import { cn } from '@/lib/utils';

type Props = {
  html: string;
  withMentions?: boolean;
  className?: string;
};

export function RenderHtml({ html, withMentions = false, className }: Props) {
  const _html = useMemo(
    () =>
      htmlParse(html, {
        replace(domNode) {
          const { attribs, tagName, children } = domNode as Element;

          console.log(attribs, tagName, children, 'FROM RICH TEXT EDITOR');

          if (!attribs) {
            return;
          }

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

  if (!html) return null;

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none text-base text-inherit prose-h1:m-0 prose-h2:m-0 prose-h3:m-0 prose-p:m-0 prose-a:font-bold prose-a:text-brand-500 prose-a:no-underline prose-blockquote:m-0 prose-img:m-0',
        className
      )}
    >
      {_html}
    </div>
  );
}
