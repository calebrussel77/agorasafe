/* eslint-disable jsx-a11y/alt-text */

/* eslint-disable @next/next/no-img-element */
import { APP_URL } from '@/constants';
import {
  type GenericLayoutInput,
  genericLayout,
} from '@/og-layouts/generic-layout';
import {
  type PublicProfileLayoutConfigInput,
  publicProfileLayout,
} from '@/og-layouts/public-profile-layout';
import {
  type ServiceRequestLayoutConfigInput,
  serviceRequestLayout,
} from '@/og-layouts/service-request-layout';
import React from 'react';

import { QS } from './qs';

// Ensures tw prop is typed.
declare module 'react' {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    tw?: string;
  }
}

const BASE_OG_URL = `${APP_URL}/api/og`;

export const buildGenericOgImageUrl = (config: GenericLayoutInput) => {
  return QS.stringifyUrl(BASE_OG_URL, {
    layoutName: genericLayout.name,
    ...config,
  });
};

export const buildPublicProfileOgImageUrl = (
  config: PublicProfileLayoutConfigInput
) => {
  return QS.stringifyUrl(BASE_OG_URL, {
    layoutName: publicProfileLayout.name,
    ...config,
  });
};

export const buildServiceRequestOgImageUrl = (
  config: ServiceRequestLayoutConfigInput
) => {
  return QS.stringifyUrl(BASE_OG_URL, {
    layoutName: serviceRequestLayout.name,
    ...config,
  });
};

export const AgorasafeLogo: React.FC<{
  theme?: 'light' | 'dark' | null;
  style?: React.CSSProperties;
}> = ({ theme = 'dark', style, ...props }) => {
  if (theme === 'light') {
    return (
      <svg
        width="104"
        height="100"
        viewBox="0 0 104 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ ...style }}
        {...props}
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M98.9707 70.7567C90.618 87.45 72.7165 99 51.9978 99C23.2808 99 0 76.8381 0 49.5C0 43.1404 1.2574 37.0637 3.55475 31.4773L11.7042 38.1857C16.4515 42.0612 19.7028 47.4599 20.9031 53.46C23.8481 68.376 36.2188 79.827 51.9032 82.1559L57.9113 83.0516C70.0091 84.8432 82.3401 82.0329 92.4568 75.1787L98.9707 70.7567ZM103.49 56.4347L86.945 67.683C78.9155 73.122 69.1292 75.3516 59.528 73.9294L53.5199 73.0337C41.8157 71.2941 32.5884 62.7566 30.3903 51.6309C28.7807 43.5878 24.4217 36.3513 18.0574 31.1567L14.427 28.1679L16.8189 28.8279C22.9848 30.5262 28.533 33.9522 32.8059 38.6996C36.672 42.9838 41.3647 46.4465 46.6035 48.8806C51.8423 51.3147 57.5194 52.6702 63.2955 52.866L64.5056 52.9084C75.4262 53.2933 86.1455 49.908 94.8534 43.3243L102.473 37.5729C104.075 43.7273 104.421 50.1446 103.49 56.4347ZM51.9978 0C35.9825 0 21.6594 6.89229 12.1202 17.7304L19.5228 19.7811C27.4004 21.9504 34.4891 26.3269 39.9485 32.3919C42.9748 35.7455 46.6483 38.4559 50.7491 40.3611C54.85 42.2663 59.2941 43.327 63.8155 43.4799L65.0209 43.527C73.7157 43.8313 82.2494 41.1337 89.1809 35.8899L99.0605 28.4319C90.755 11.6301 72.8016 0 51.9978 0Z"
          fill="url(#paint0_linear_689_188)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_689_188"
            x1="51.9978"
            y1="0"
            x2="51.9978"
            y2="99"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#354CD0" />
            <stop offset="1" stop-color="#AA50A8" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width="104"
      height="100"
      viewBox="0 0 104 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ ...style }}
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M98.9707 70.7567C90.618 87.45 72.7165 99 51.9978 99C23.2808 99 0 76.8381 0 49.5C0 43.1404 1.2574 37.0637 3.55475 31.4773L11.7042 38.1857C16.4515 42.0612 19.7028 47.4599 20.9031 53.46C23.8481 68.376 36.2188 79.827 51.9032 82.1559L57.9113 83.0516C70.0091 84.8432 82.3401 82.0329 92.4568 75.1787L98.9707 70.7567ZM103.49 56.4347L86.945 67.683C78.9155 73.122 69.1292 75.3516 59.528 73.9294L53.5199 73.0337C41.8157 71.2941 32.5884 62.7566 30.3903 51.6309C28.7807 43.5878 24.4217 36.3513 18.0574 31.1567L14.427 28.1679L16.8189 28.8279C22.9848 30.5262 28.533 33.9522 32.8059 38.6996C36.672 42.9838 41.3647 46.4465 46.6035 48.8806C51.8423 51.3147 57.5194 52.6702 63.2955 52.866L64.5056 52.9084C75.4262 53.2933 86.1455 49.908 94.8534 43.3243L102.473 37.5729C104.075 43.7273 104.421 50.1446 103.49 56.4347ZM51.9978 0C35.9825 0 21.6594 6.89229 12.1202 17.7304L19.5228 19.7811C27.4004 21.9504 34.4891 26.3269 39.9485 32.3919C42.9748 35.7455 46.6483 38.4559 50.7491 40.3611C54.85 42.2663 59.2941 43.327 63.8155 43.4799L65.0209 43.527C73.7157 43.8313 82.2494 41.1337 89.1809 35.8899L99.0605 28.4319C90.755 11.6301 72.8016 0 51.9978 0Z"
        fill="url(#paint0_linear_689_188)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_689_188"
          x1="51.9978"
          y1="0"
          x2="51.9978"
          y2="99"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#354CD0" />
          <stop offset="1" stop-color="#AA50A8" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const GradientBackground: React.FC<{
  theme?: 'light' | 'dark' | null;
}> = ({ theme = 'dark' }) => {
  if (theme == 'dark') {
    return (
      <div
        tw="absolute inset-0 flex justify-start items-end w-full h-full"
        style={{ background: `#1f224c` }}
      >
        <div
          tw="absolute inset-0"
          style={{
            background:
              'linear-gradient(327.21deg, rgba(33, 0, 75, 0.35) 3.65%, rgba(60, 0, 136, 0) 40.32%)',
          }}
        />
        <div
          tw="absolute inset-0"
          style={{
            background:
              'linear-gradient(245.93deg, rgba(209, 21, 111, 0.26) 0%, rgba(31, 34, 76, 0.2) 36.63%)',
          }}
        />
        <div
          tw="absolute inset-0"
          style={{
            background:
              'linear-gradient(147.6deg, rgba(58, 19, 255, 0) 29.79%, rgba(98, 19, 255, 0.1) 85.72%)',
          }}
        />
      </div>
    );
  }

  return (
    <div tw="absolute inset-0 flex justify-start items-end w-full h-full bg-white">
      <div
        tw="absolute inset-0"
        style={{
          background:
            'linear-gradient(71.9deg, rgba(53, 76, 208, 0.5) 10.4%, rgba(209, 25, 80, 0) 46.76%)',
        }}
      />
      <div
        tw="absolute inset-0"
        style={{
          background:
            'linear-gradient(149.36deg, rgba(53, 76,208, 0.1) -101.9%, rgba(223, 231, 250, 0.3) 2.22%)',
        }}
      />
    </div>
  );
};
