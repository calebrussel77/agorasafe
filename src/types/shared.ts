import {
  type FocusEvent,
  type AriaAttributes,
  type AriaRole,
  type CSSProperties,
  type DOMAttributes as ReactDOMAttributes,
} from 'react';


/** Any focusable element, including both HTML and SVG elements. */
export interface FocusableElement extends Element, HTMLOrSVGElement { }


/** All DOM attributes supported across both HTML and SVG elements. */
export interface DOMAttributes<T = FocusableElement> extends AriaAttributes, ReactDOMAttributes<T> {
  id?: string | undefined,
  role?: AriaRole | undefined,
  tabIndex?: number | undefined,
  style?: CSSProperties | undefined,
  className?: string | undefined
}

export interface HoverEvent {
  /** The type of hover event being fired. */
  type: 'hoverstart' | 'hoverend',
  /** The pointer type that triggered the hover event. */
  pointerType: 'mouse' | 'pen',
  /** The target element of the hover event. */
  target: HTMLElement
}

export interface FocusEvents<Target = Element> {
  /** Handler that is called when the element receives focus. */
  onFocus?: (e: FocusEvent<Target>) => void,
  /** Handler that is called when the element loses focus. */
  onBlur?: (e: FocusEvent<Target>) => void,
  /** Handler that is called when the element's focus status changes. */
  onFocusChange?: (isFocused: boolean) => void
}

export interface HoverEvents {
  /** Handler that is called when a hover interaction starts. */
  onHoverStart?: (e: HoverEvent) => void,
  /** Handler that is called when a hover interaction ends. */
  onHoverEnd?: (e: HoverEvent) => void,
  /** Handler that is called when the hover state changes. */
  onHoverChange?: (isHovering: boolean) => void
}