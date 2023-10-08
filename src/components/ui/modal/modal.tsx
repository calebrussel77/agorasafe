/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { useMergeRefs } from '@/hooks/use-merge-refs';

import { Typography } from '../typography';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({
  className,
  children,
  ...props
}: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal className={cn(className)} {...props}>
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      {children}
    </div>
  </DialogPrimitive.Portal>
);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-white/60 backdrop-blur-sm transition-all duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const scrollRef = React.useRef<HTMLElement>(null);
  const refs = useMergeRefs(scrollRef, ref);

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={refs}
        style={{
          maxHeight: `calc(100vh - 4rem * 2)`,
        }}
        className={cn(
          'scrollbar__custom fixed left-[50%] top-[50%] z-50 grid w-full max-w-xl translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto rounded-b-lg border bg-background',
          'shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95',
          'data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2',
          'data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
          'focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  children,
  shouldHideCloseButton,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  shouldHideCloseButton?: boolean;
}) => (
  <div
    className={cn(
      'sticky inset-x-0 -top-1 z-10 flex w-full flex-row items-start justify-between bg-background bg-white px-6 py-4',
      'border-b',
      className
    )}
    {...props}
  >
    <div className="flex w-full flex-col space-y-1.5 text-center sm:text-left">
      {children}
    </div>
    {!shouldHideCloseButton && (
      <DialogPrimitive.Close className="absolute right-3 top-3 rounded-full bg-zinc-100 p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    )}
  </div>
);

DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'sticky inset-x-0 bottom-0 z-10 flex flex-col-reverse bg-background bg-white px-6 py-3 sm:flex-row sm:justify-end sm:space-x-2',
        'border-t',
        className
      )}
      {...props}
    />
  );
};
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className,onClick, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} asChild>
    <Typography variant="small" className={cn(className)} {...props} />
  </DialogPrimitive.Description>
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

type ClassNames = {
  root?: string;
  header?: string;
  title?: string;
  description?: string;
  main?: string;
  footer?: string;
};
interface ModalProps {
  trigger?: React.ReactNode;
  footer?: React.ReactNode;
  name?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  shouldHideCloseButton?: boolean;
  triggerProps?: React.ComponentPropsWithoutRef<typeof DialogTrigger>;
  classNames?: Partial<ClassNames>;
}

const Modal = React.forwardRef<
  React.ElementRef<typeof Dialog>,
  ModalProps & React.ComponentPropsWithoutRef<typeof Dialog>
>(
  (
    {
      trigger,
      open,
      name,
      description,
      shouldHideCloseButton,
      onOpenChange,
      triggerProps,
      footer,
      children,
      classNames,
      ...rest
    },
    ref
  ) => {
    const shouldDisplayHeader = name || description;

    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...rest}>
        <DialogTrigger {...triggerProps}>{trigger}</DialogTrigger>
        <DialogContent className={classNames?.root}>
          {shouldDisplayHeader && (
            <DialogHeader
              className={classNames?.header}
              shouldHideCloseButton={shouldHideCloseButton}
            >
              {name && (
                <DialogTitle className={classNames?.title}>{name}</DialogTitle>
              )}
              {description && (
                <DialogDescription className={classNames?.description}>
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          {children && (
            <div className={cn('px-6 py-3', classNames?.main)}>{children}</div>
          )}

          {footer && (
            <DialogFooter className={classNames?.footer}>{footer}</DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }
);

Modal.displayName = 'Modal';

const useModal = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return { open: isOpen, onOpenChange: setIsOpen };
};

export { Modal, useModal, DialogContent, Dialog };
