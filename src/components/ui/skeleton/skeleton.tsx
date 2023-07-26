import { cn } from '@/lib/utils';

import {
  type AvatarSize,
  avatarSizeClasses as skeletonCircleClasses,
  avatarShapeClasses as skeletonShapeClasses,
} from '../avatar';

interface SkeletonProps extends React.ComponentPropsWithoutRef<'div'> {
  visible?: boolean;
  circleSize?: AvatarSize;
  children?: JSX.Element | React.ReactNode;
  shape?: 'rounded' | 'circle' | 'square';
}

function Skeleton(props: SkeletonProps) {
  const {
    className,
    shape = 'rounded',
    visible = true,
    children,
    circleSize,
    ...rest
  } = props;

  const skeletonCircleClassName = circleSize
    ? skeletonCircleClasses[circleSize]
    : undefined;

  const skeletonShapeClassName = shape
    ? skeletonShapeClasses[shape]
    : undefined;

  if (visible || !('visible' in props))
    return (
      <div
        className={cn(
          'h-4 animate-pulse bg-muted',
          skeletonShapeClassName,
          shape === 'circle' && skeletonCircleClassName,
          className
        )}
        {...rest}
      />
    );

  return typeof children !== 'undefined'
    ? (children as React.ReactElement)
    : null;
}

export { Skeleton };
