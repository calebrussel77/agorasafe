import headlessuiPlugin from '@headlessui/tailwindcss';
import tailwindCssTypographyPlugin from '@tailwindcss/typography';
import { type Config } from 'tailwindcss';
// TODO: need to remove this library in the future
import tailwindCssAnimatePlugin from 'tailwindcss-animate';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'Inter var, sans-serif',
          {
            fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
            fontVariationSettings: 'normal',
          },
          // ...defaultTheme.fontFamily.sans,
        ],
      },
      colors: {
        brand: {
          50: `rgb(var(--color-brand-50) / <alpha-value>)`,
          100: `rgb(var(--color-brand-100) / <alpha-value>)`,
          200: `rgb(var(--color-brand-200) / <alpha-value>)`,
          300: `rgb(var(--color-brand-300) / <alpha-value>)`,
          400: `rgb(var(--color-brand-400) / <alpha-value>)`,
          500: `rgb(var(--color-brand-500) / <alpha-value>)`,
          600: `rgb(var(--color-brand-600) / <alpha-value>)`,
          700: `rgb(var(--color-brand-700) / <alpha-value>)`,
          800: `rgb(var(--color-brand-800) / <alpha-value>)`,
          900: `rgb(var(--color-brand-900) / <alpha-value>)`,
        },

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    tailwindCssAnimatePlugin,
    headlessuiPlugin,
    tailwindCssTypographyPlugin,
  ],
} as Config;

// satisfies Config;
