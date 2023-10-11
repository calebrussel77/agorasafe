import { usePathname, useSearchParams } from 'next/navigation';

export const usePathWithSearchParams = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;
};
