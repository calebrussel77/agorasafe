/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { type DOMAttributes, type HoverEvents } from '@/types/shared';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface HoverProps extends HoverEvents {
    /** Whether the hover events should be disabled. */
    isDisabled?: boolean
}

export interface HoverResult {
    /** Props to spread on the target element. */
    hoverProps: DOMAttributes,
    isHovered: boolean
}

// iOS fires onPointerEnter twice: once with pointerType="touch" and again with pointerType="mouse".
// We want to ignore these emulated events so they do not trigger hover behavior.
// See https://bugs.webkit.org/show_bug.cgi?id=214609.
let isGlobalIgnoreEmulatedMouseEvents = false;
let hoverCount = 0;

function setIsGlobalIgnoreEmulatedMouseEvents() {
    isGlobalIgnoreEmulatedMouseEvents = true;

    // Clear isGlobalIgnoreEmulatedMouseEvents after a short timeout. iOS fires onPointerEnter
    // with pointerType="mouse" immediately after onPointerUp and before onFocus. On other
    // devices that don't have this quirk, we don't want to ignore a mouse hover sometime in
    // the distant future because a user previously touched the element.
    setTimeout(() => {
        isGlobalIgnoreEmulatedMouseEvents = false;
    }, 50);
}

function handleGlobalPointerEvent(e: PointerEvent) {
    if (e.pointerType === 'touch') {
        setIsGlobalIgnoreEmulatedMouseEvents();
    }
}

function setupGlobalTouchEvents() {
    if (typeof document === 'undefined') {
        return;
    }

    if (typeof PointerEvent !== 'undefined') {
        document.addEventListener('pointerup', handleGlobalPointerEvent);
    } else {
        document.addEventListener('touchend', setIsGlobalIgnoreEmulatedMouseEvents);
    }

    hoverCount++;
    return () => {
        hoverCount--;
        if (hoverCount > 0) {
            return;
        }

        if (typeof PointerEvent !== 'undefined') {
            document.removeEventListener('pointerup', handleGlobalPointerEvent);
        } else {
            document.removeEventListener('touchend', setIsGlobalIgnoreEmulatedMouseEvents);
        }
    };
}

/**
 * Handles pointer hover interactions for an element. Normalizes behavior
 * across browsers and platforms, and ignores emulated mouse events on touch devices.
 */
export function useHover(props: HoverProps): HoverResult {
    const {
        onHoverStart,
        onHoverChange,
        onHoverEnd,
        isDisabled
    } = props;

    const [isHovered, setHovered] = useState(false);
    const state = useRef({
        isHovered: false,
        ignoreEmulatedMouseEvents: false,
        pointerType: '',
        target: null
    }).current;

    useEffect(setupGlobalTouchEvents, []);

    const { hoverProps, triggerHoverEnd } = useMemo(() => {
        const triggerHoverStart = (event: any, pointerType: PointerEvent['pointerType']) => {
            state.pointerType = pointerType;
            if (isDisabled || pointerType === 'touch' || state.isHovered || !event.currentTarget.contains(event.target)) {
                return;
            }

            state.isHovered = true;
            const target = event.currentTarget;
            state.target = target;

            if (onHoverStart) {
                onHoverStart({
                    type: 'hoverstart',
                    target,
                    pointerType: pointerType as never
                });
            }

            if (onHoverChange) {
                onHoverChange(true);
            }

            setHovered(true);
        };

        const triggerHoverEnd = (event: any, pointerType: PointerEvent['pointerType']) => {
            state.pointerType = '';
            state.target = null;

            if (pointerType === 'touch' || !state.isHovered) {
                return;
            }

            state.isHovered = false;
            const target = event.currentTarget;
            if (onHoverEnd) {
                onHoverEnd({
                    type: 'hoverend',
                    target,
                    pointerType: pointerType as never

                });
            }

            if (onHoverChange) {
                onHoverChange(false);
            }

            setHovered(false);
        };

        const hoverProps: DOMAttributes = {};

        if (typeof PointerEvent !== 'undefined') {
            hoverProps.onPointerEnter = (e) => {
                if (isGlobalIgnoreEmulatedMouseEvents && e.pointerType === 'mouse') {
                    return;
                }

                triggerHoverStart(e, e.pointerType);
            };

            hoverProps.onPointerLeave = (e) => {
                if (!isDisabled && e.currentTarget.contains(e.target as Element)) {
                    triggerHoverEnd(e, e.pointerType);
                }
            };
        } else {
            hoverProps.onTouchStart = () => {
                state.ignoreEmulatedMouseEvents = true;
            };

            hoverProps.onMouseEnter = (e) => {
                if (!state.ignoreEmulatedMouseEvents && !isGlobalIgnoreEmulatedMouseEvents) {
                    triggerHoverStart(e, 'mouse');
                }

                state.ignoreEmulatedMouseEvents = false;
            };

            hoverProps.onMouseLeave = (e) => {
                if (!isDisabled && e.currentTarget.contains(e.target as Element)) {
                    triggerHoverEnd(e, 'mouse');
                }
            };
        }
        return { hoverProps, triggerHoverEnd };
    }, [onHoverStart, onHoverChange, onHoverEnd, isDisabled, state]);

    useEffect(() => {
        // Call the triggerHoverEnd as soon as isDisabled changes to true
        // Safe to call triggerHoverEnd, it will early return if we aren't currently hovering
        if (isDisabled) {
            triggerHoverEnd({ currentTarget: state.target }, state.pointerType);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDisabled]);

    return {
        hoverProps,
        isHovered
    };
}
