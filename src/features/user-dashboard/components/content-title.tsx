import { cn } from '@/lib/utils';

const ContentTitle = ({
  children,
  className,
  description,
}: React.PropsWithChildren<{ className?: string; description?: string }>) => {
  return (
    <div className={cn('border-b border-gray-200 px-4 pb-3', className)}>
      <h1 className="border-gray-300 text-3xl font-semibold text-brand-600">
        {children}
      </h1>
      {description && (
        <p className="mt-1.5 w-full max-w-2xl text-gray-500 xl:max-w-4xl">
          {description}
        </p>
      )}
    </div>
  );
};

export { ContentTitle };
