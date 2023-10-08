import React, {
  type FC,
  type ReactElement,
  useCallback,
  useState,
} from 'react';
import TruncateMarkup, {
  type TruncateProps as TruncateMarkupProps,
} from 'react-truncate-markup';

import { cn } from '@/lib/utils';

import { FadeAnimation } from '../fade-animation';

interface TruncateProps
  extends Omit<TruncateMarkupProps, 'lineHeight' | 'ellipsis'> {
  className?: string;
  hasEllipsisText?: boolean;
  renderEllipsis?: (props: {
    onToggleTruncate: () => void;
    shouldTruncate: boolean;
  }) => JSX.Element | ReactElement;
  shouldDefaultTruncate?: boolean;
  onClick?: () => void;
}

interface DefaultEllipsisProps {
  onToggleTruncate: () => void;
  text: string;
  shouldTruncate: boolean;
  className?: string;
}

const DefaultEllipsis: FC<DefaultEllipsisProps> = ({
  onToggleTruncate,
  shouldTruncate,
  className,
  text,
}) => {
  return (
    <span>
      {shouldTruncate && <>...</>}{' '}
      <span
        onClick={onToggleTruncate}
        className={cn(
          'cursor-pointer font-semibold hover:underline',
          className
        )}
      >
        {text}
      </span>
    </span>
  );
};

const Truncate: FC<TruncateProps> = ({
  children,
  lines = 1,
  className,
  hasEllipsisText = false,
  renderEllipsis,
  shouldDefaultTruncate = true,
  onTruncate,
  onClick,
  tokenize = 'words',
}) => {
  const [shouldTruncate, setShouldTruncate] = useState(shouldDefaultTruncate);

  const onToggleTruncate = useCallback(
    () => setShouldTruncate(!shouldTruncate),
    [shouldTruncate]
  );

  return (
    <>
      {shouldTruncate ? (
        <TruncateMarkup
          lines={lines}
          onTruncate={onTruncate}
          tokenize={tokenize}
          ellipsis={
            hasEllipsisText ? (
              renderEllipsis ? (
                <>
                  ...{' '}
                  {renderEllipsis({
                    onToggleTruncate,
                    shouldTruncate,
                  })}
                </>
              ) : (
                <DefaultEllipsis
                  onToggleTruncate={onToggleTruncate}
                  shouldTruncate={shouldTruncate}
                  text="Voir plus"
                />
              )
            ) : undefined
          }
        >
          <span onClick={onClick} className={cn('block w-auto', className)}>
            {children}
          </span>
        </TruncateMarkup>
      ) : (
        <FadeAnimation
          className={className}
          from={{ y: 10, opacity: 0 }}
          isVisible={!shouldTruncate}
          onClick={onClick}
          animateEnter
        >
          {children}
          {renderEllipsis ? (
            <>
              {' '}
              {renderEllipsis({
                onToggleTruncate,
                shouldTruncate,
              })}
            </>
          ) : (
            <DefaultEllipsis
              onToggleTruncate={onToggleTruncate}
              shouldTruncate={shouldTruncate}
              text="Voir moins"
            />
          )}
        </FadeAnimation>
      )}
    </>
  );
};

export { Truncate, type TruncateProps };
