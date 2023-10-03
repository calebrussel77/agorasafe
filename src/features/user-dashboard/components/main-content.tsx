import { cn } from '@/lib/utils';

const MainContent = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={cn(
        'my-6 flex flex-col justify-center lg:ml-[350px]',
        className
      )}
    >
      {children}
    </div>
  );
};

export { MainContent };
