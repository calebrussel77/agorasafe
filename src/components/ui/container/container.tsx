import { cn } from '@/lib/utils';

export function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <section
      className={cn('mx-auto w-full max-w-7xl px-4', className)}
      {...props}
    />
  );
}
