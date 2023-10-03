import { type ReactNode } from 'react';

const FormCardContainer = ({
  children,
  footer,
}: React.PropsWithChildren<{ footer?: ReactNode }>) => {
  return (
    <div className="rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:p-6">{children}</div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">{footer}</div>
    </div>
  );
};

export { FormCardContainer };
