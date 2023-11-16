import { ComponentProps } from 'react';
import {
  type GroupBase,
  type Props,
  type StylesConfig,
  type Theme,
} from 'react-select';

import { type Variant, getVariantCssColor } from '@/utils/variants';

export const defaultStyles = (variant: Variant | undefined) => {
  return {
    control: (baseStyles, state) => {
      return {
        ...baseStyles,
        borderWidth: '1.5px',
        // zIndex: '9999',
        outline: '1px solid transparent',
        borderColor: variant
          ? getVariantCssColor(variant)
          : state.isFocused
          ? 'rgb(var(--color-brand-500))'
          : 'rgb(209 213 219)',
        backgroundColor: state.isFocused
          ? 'transparent'
          : state.isDisabled
          ? 'rgba(229, 231, 235, 0.7)'
          : 'white',
        borderRadius: '0.25rem',
        padding: '0.7px 0px',
        // '&:hover': {
        //   backgroundColor: state.isFocused ? '' : 'rgb(243 244 246)',
        // },
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        transitionDuration: '300ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionProperty:
          'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter',
      };
    },
    multiValue: (baseStyles, state) => {
      return {
        ...baseStyles,
        backgroundColor: 'rgb(229 231 235)',
        borderRadius: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyItems: 'center',
      };
    },
    multiValueLabel: (baseStyles, state) => ({
      ...baseStyles,
      color: 'rgba(82,85,90,1)',
    }),
    multiValueRemove: (baseStyles, state) => ({
      ...baseStyles,
      color: 'rgba(82,85,90,1)',
      '&:hover': {
        backgroundColor: 'rgba(243, 244, 246, 0.5)',
      },
    }),
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      color: 'rgb(156, 163, 175)',
      fontSize: '14px',
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      color: state.isSelected
        ? 'white'
        : state.isDisabled
        ? '#ccc'
        : 'rgb(31, 41, 55)',
      fontSize: '14px',
      zIndex: '9999',
    }),
    menu: (baseStyles, state) => {
      return {
        ...baseStyles,
        padding: '12px 0px',
        marginBottom: '20px',
        zIndex: '9999',
        backgroundColor: 'white',
        borderRadius: '0px',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); ',
      };
    },
  } as Props['styles'];
};

export const defaultTheme = (theme: Theme) => {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary25: 'rgb(241 245 249)',
      primary: 'rgb(var(--color-brand-500))',
      danger: ' rgba(239, 68, 68, 1)',
      dangerLight: 'rgba(254, 226, 226, 1)',
    },
  };
};
