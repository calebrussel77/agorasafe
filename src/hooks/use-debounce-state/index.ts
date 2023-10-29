/* eslint-disable testing-library/await-async-utils */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useDebouncedState<T = any>(
  defaultValue: T,
  wait: number,
  options = { leading: false }
) {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<number | null>(null);
  const leadingRef = useRef(true);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const clearTimeout = () => window.clearTimeout(timeoutRef.current!);
  useEffect(() => clearTimeout, []);

  const debouncedSetValue = useCallback(
    (newValue: T) => {
      clearTimeout();
      if (leadingRef.current && options.leading) {
        setValue(newValue);
      } else {
        timeoutRef.current = window.setTimeout(() => {
          leadingRef.current = true;
          setValue(newValue);
        }, wait);
      }
      leadingRef.current = false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.leading]
  );

  return [value, debouncedSetValue] as const;
}
