import { type RefObject, useEffect, useState } from 'react';

import { invariant } from '@/utils/misc';

type UseAppearOnTargetProps = {
  targetedRef?: RefObject<HTMLElement>;
  elementRef: RefObject<HTMLElement>;
  targetedSelector?: string;
  classNameList: string[];
  options?: IntersectionObserverInit;
};

const useAppearOnTarget = ({
  options,
  elementRef,
  targetedRef,
  targetedSelector,
  classNameList,
}: UseAppearOnTargetProps) => {
  const [isAppear, setIsAppear] = useState(false);

  useEffect(() => {
    const targetedElement = document.querySelector(targetedSelector || '');
    const hasTargetElement = targetedElement || targetedRef?.current;
    if (!hasTargetElement) return;

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          setIsAppear(true);
          elementRef?.current?.classList?.add(...classNameList);
        } else {
          setIsAppear(false);
          elementRef?.current?.classList?.remove(...classNameList);
        }
      });
    }, options);

    invariant(targetedElement, 'unknown value targetedElement');

    sectionObserver?.observe(targetedElement || targetedRef?.current);
  });

  return { isAppear, setIsAppear, elementRef };
};

export { useAppearOnTarget };
