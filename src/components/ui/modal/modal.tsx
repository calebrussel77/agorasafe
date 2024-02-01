/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Portal as HeadlessUIPortal } from '@headlessui/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Typography } from '../typography';

type ClassNames = {
  title?: string;
  description?: string;
};

const Dialog = DialogPrimitive.Root;

const DialogPortal = ({
  children,
  ...props
}: DialogPrimitive.DialogPortalProps) => (
  // ! The @radix-ui `portal` component doesn't work well with ssr
  // ! so i have to use the `headless ui portal compoent` who support ssr by avoiding me server hydratation errors
  // ! see this issue for more: https://github.com/radix-ui/primitives/issues/1386
  <HeadlessUIPortal>{children}</HeadlessUIPortal>
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
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    isFullScreen?: boolean;
  }
>(({ className, children, isFullScreen = false, ...props }, ref) => {
  return (
    <DialogPrimitive.Content
      ref={ref}
      style={{
        maxHeight: isFullScreen ? '100vh' : `calc(100vh - 4rem * 2)`,
      }}
      className={cn(
        'focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent',
        className,
        [
          'scrollbar__custom fixed left-[50%] top-[50%] z-50 flex w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] flex-col',
          'overflow-y-auto border bg-background sm:rounded-lg',
          'shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          'data-[state=open]:fade-in-0',
        ],
        isFullScreen
          ? [
              'inset-0 max-w-none translate-x-0 translate-y-0',
              'data-[state=open]:fade-in-0',
              'data-[state=closed]:slide-out-to-bottom-[-150%]',
              'data-[state=open]:slide-in-from-bottom-[100%]',
              'shadow-none duration-500',
            ]
          : [
              'data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'data-[state=closed]:slide-out-to-top-[48%]',
              'data-[state=open]:slide-in-from-top-[48%]',
            ]
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  );
});

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  title,
  withCloseIcon = true,
  classNames,
  description,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
  withCloseIcon?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  classNames?: Pick<ClassNames, 'title' | 'description'>;
}) => (
  <div
    className={cn(
      'sticky inset-x-0 top-0 flex w-full flex-row items-start justify-between bg-background bg-white px-4 py-4 sm:px-6',
      'z-30 border-b',
      className
    )}
    {...props}
  >
    <div className="flex w-full flex-col space-y-1.5 text-left">
      {title && (
        <DialogTitle className={classNames?.title}>{title}</DialogTitle>
      )}
      {description && (
        <DialogDescription className={classNames?.description}>
          {description}
        </DialogDescription>
      )}
    </div>
    {withCloseIcon && (
      <DialogPrimitive.Close className="absolute right-2 top-3 rounded-full bg-zinc-200 p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground sm:right-3">
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
        'sticky inset-x-0 bottom-0 flex flex-col-reverse bg-background bg-white px-4 py-3 sm:flex-row sm:justify-end sm:space-x-2 sm:px-6',
        'z-30 border-t',
        className
      )}
      {...props}
    />
  );
};

const DialogMain = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('h-full flex-1 px-4 py-6 sm:py-6', className)}
      {...props}
    />
  );
};

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'line-clamp-1 text-xl font-semibold tracking-tight',
      className
    )}
    {...props}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, onClick, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} asChild>
    <Typography
      variant="subtle"
      className={cn('leading-6', className)}
      {...props}
    />
  </DialogPrimitive.Description>
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export interface ModalProps
  extends Pick<
    React.ComponentPropsWithoutRef<typeof Dialog>,
    'open' | 'onOpenChange' | 'children' | 'defaultOpen'
  > {
  className?: string;
  isFullScreen?: boolean;
}

const Modal = React.forwardRef<React.ElementRef<typeof Dialog>, ModalProps>(
  ({ open, onOpenChange, children, className, isFullScreen, ...rest }, ref) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...rest}>
        <DialogPortal>
          {!isFullScreen && <DialogOverlay />}
          <DialogContent
            ref={ref}
            isFullScreen={isFullScreen}
            className={cn(className)}
          >
            {children}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  }
);

Modal.displayName = 'Modal';

export {
  Modal,
  DialogContent,
  Dialog,
  DialogMain as ModalMain,
  DialogFooter as ModalFooter,
  DialogHeader as ModalHeader,
};
