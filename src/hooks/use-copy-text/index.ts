import copyToClipboard from 'copy-to-clipboard';
import { useCallback, useState } from 'react';

export type Content =
  | React.RefObject<HTMLElement | HTMLInputElement>
  | number
  | string;
export type Timeout = number;

export function useCopyText(content: Content, timeout: Timeout = 1_500) {
  const [isCopied, setisCopied] = useState<boolean>(false);

  const copy = useCallback(() => {
    let value: unknown;
    if (typeof content === 'number' || typeof content === 'string') {
      value = content.toString();
    } else if (content.current instanceof HTMLInputElement) {
      value = content.current.value;
    } else if (content.current instanceof HTMLElement) {
      value = content.current.textContent;
    }

    const isStringCopied = copyToClipboard(value as string);
    setisCopied(isStringCopied);

    if (timeout) {
      setTimeout(setisCopied, timeout);
    }
  }, [content, timeout]);

  return { copy, isCopied };
}
