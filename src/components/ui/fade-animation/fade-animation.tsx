import React, {
  CSSProperties,
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
 * @param {boolean} visible
 * @param {React.ReactNode} children
 * @param {number} duration en ms
 * @param {boolean} animateEnter Anime l'arrivée de l'élément
 * @param {{opacity?: number, x?: number, y?: number, z?: number}} from
 **/

/**
 * Usage :
 * <FadeAnimation visible={true} from={{ opacity: 0, x: 10 }} duration={1000}>
 *  <div>Hello</div>
 * </FadeAnimation>
 */

type fadeProps = {
  visible: boolean;
  children: React.ReactNode;
  duration?: number;
  animateEnter?: boolean;
  onLeave?: () => void;
  className?: string;
  style?: CSSProperties;
  from?: { opacity?: number; x?: number; y?: number; z?: number };
} & React.HTMLProps<HTMLDivElement>;

const FadeAnimation = forwardRef<HTMLDivElement, fadeProps>(
  (
    {
      visible,
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
      visible ? (animateEnter ? ENTERING : VISIBLE) : HIDDEN
    );

    if (visible) {
      childRef.current = children;
    }

    useEffect(() => {
      if (!visible) {
        setState(LEAVING);
      } else {
        setState(s => (s === HIDDEN ? ENTERING : VISIBLE));
      }
    }, [visible]);

    useEffect(() => {
      return onLeave && onLeave();
    }, []);

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
        {visible ? childRef.current : null}
      </div>
    );
  }
);

export { FadeAnimation };

FadeAnimation.displayName = 'CustomInput';
