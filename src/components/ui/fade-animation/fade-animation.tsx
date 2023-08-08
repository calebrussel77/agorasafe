import React, {
  type CSSProperties,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';

const VISIBLE = 1;
const HIDDEN = 2;
const ENTERING = 3;
const LEAVING = 4;

/**
 * @param {boolean} isVisible
 * @param {React.ReactNode} children
 * @param {number} duration en ms
 * @param {boolean} animateEnter Anime l'arrivée de l'élément
 * @param {{opacity?: number, x?: number, y?: number, z?: number}} from
 **/

/**
 * Usage :
 * <FadeAnimation isVisible={true} from={{ opacity: 0, x: 10 }} duration={1000}>
 *  <div>Hello</div>
 * </FadeAnimation>
 */

type FadeProps = {
  isVisible: boolean;
  children: React.ReactNode;
  duration?: number;
  animateEnter?: boolean;
  onLeave?: () => void;
  className?: string;
  style?: CSSProperties;
  from?: { opacity?: number; x?: number; y?: number; z?: number };
} & React.HTMLProps<HTMLDivElement>;

const FadeAnimation = forwardRef<HTMLDivElement, FadeProps>(
  (
    {
      isVisible,
      children,
      duration = 300,
      animateEnter = false,
      onLeave,
      style,
      className,
      from = { opacity: 0 },
      ...restProps
    },
    ref
  ) => {
    const childRef = useRef(children);

    const [state, setState] = useState(
      isVisible ? (animateEnter ? ENTERING : VISIBLE) : HIDDEN
    );

    if (isVisible) {
      childRef.current = children;
    }

    useEffect(() => {
      if (!isVisible) {
        setState(LEAVING);
      } else {
        setState(s => (s === HIDDEN ? ENTERING : VISIBLE));
      }
    }, [isVisible]);

    useEffect(() => {
      return onLeave && onLeave();
    }, [onLeave]);

    useEffect(() => {
      if (state === LEAVING) {
        const timer = setTimeout(() => {
          setState(HIDDEN);
        }, duration);
        return () => {
          clearTimeout(timer);
        };
      } else if (state === ENTERING) {
        document.body.offsetHeight;
        setState(VISIBLE);
      }
    }, [duration, state]);

    if (state === HIDDEN) {
      return null;
    }

    const defaultStyle = {
      transitionDuration: `${duration}ms`,
      transitionProperty: 'opacity transform',
    } as CSSProperties;

    if (state !== VISIBLE) {
      if (from.opacity !== undefined) {
        Object.assign(defaultStyle, {
          opacity: from.opacity,
        });
      }
      Object.assign(defaultStyle, {
        transform: `translate3d(${from.x ?? 0}px, ${from.y ?? 0}px, ${
          from.z ?? 0
        }px)`,
      });
    }

    return (
      <div
        ref={ref}
        style={{ ...defaultStyle, ...style }}
        className={className}
        {...restProps}
      >
        {isVisible ? childRef.current : null}
      </div>
    );
  }
);

export { FadeAnimation };

FadeAnimation.displayName = 'CustomInput';
