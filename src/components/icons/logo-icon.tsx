import React, { type FC, useId } from 'react';

type LogoProps = {
  className?: string;
};

type TLogoSymbolIconProps = {
  className?: string;
};

const LogoIcon: FC<LogoProps> = ({ className }) => {
  const id = useId();

  return (
    <svg className={className} fill="none" viewBox="0 0 182 23">
      <path
        stroke="#354CD0"
        strokeLinecap="round"
        strokeWidth="2"
        d="M1 -1L20.689 -1"
        transform="matrix(-.27337 .96191 -.96807 -.25068 5.929 1.137)"
      ></path>
      <path
        stroke="#354CD0"
        strokeLinecap="round"
        strokeWidth="2"
        d="M6.41 1l9.832 20.666"
      ></path>
      <path
        stroke="#354CD0"
        strokeLinecap="round"
        strokeWidth="2"
        d="M1 -1L20.689 -1"
        transform="matrix(-.27337 .96191 -.96807 -.25068 140.407 1.137)"
      ></path>
      <path
        stroke="#354CD0"
        strokeLinecap="round"
        strokeWidth="2"
        d="M140.887 1l9.832 20.666"
      ></path>
      <path
        stroke="#354CD0"
        strokeLinecap="round"
        strokeWidth="2"
        d="M1 -1L20.689 -1"
        transform="matrix(-.27337 .96191 -.96807 -.25068 99.25 1.137)"
      ></path>
      <path
        stroke="#354CD0"
        strokeLinecap="round"
        strokeWidth="2"
        d="M99.73 1l9.833 20.666M72.157 12.463h11a4 4 0 004-4V5a4 4 0 00-4-4h-11M83.242 13.094L86.822 22M72.657 12.463v9.379"
      ></path>
      <path
        fill={`url(#${id})`}
        fillRule="evenodd"
        d="M65.094 16.009C63.327 19.55 59.54 22 55.157 22c-6.075 0-11-4.701-11-10.5 0-1.349.266-2.638.752-3.823L46.633 9.1a5.604 5.604 0 011.946 3.24c.623 3.164 3.24 5.593 6.558 6.087l1.271.19a10.31 10.31 0 007.308-1.67l1.377-.938zm.956-3.038l-3.5 2.386a8.183 8.183 0 01-5.8 1.325l-1.271-.19c-2.476-.369-4.428-2.18-4.893-4.54a7.512 7.512 0 00-2.609-4.343l-.768-.634.506.14a7.076 7.076 0 013.382 2.094 9.093 9.093 0 006.45 3.005l.256.009a10.04 10.04 0 006.42-2.033l1.612-1.22a10.069 10.069 0 01.215 4zM55.157 1c-3.388 0-6.418 1.462-8.436 3.761l1.566.435a9.04 9.04 0 014.321 2.675 7.117 7.117 0 005.049 2.352l.255.01a7.993 7.993 0 005.111-1.62l2.09-1.582C63.356 3.467 59.559 1 55.158 1z"
        clipRule="evenodd"
      ></path>
      <path
        stroke="#354CD0"
        strokeLinecap="round"
        strokeWidth="2"
        d="M38.157 3.71S34.747 1 32.702 1c-1.081 0-3.687.19-5.904.368a3.968 3.968 0 00-3.641 3.964V18a4 4 0 004 4h5.941a4 4 0 002.82-1.162l1.353-1.345a3 3 0 00.886-2.128v-4.849"
      ></path>
      <path
        stroke="#354CD0"
        strokeWidth="2"
        d="M166.635 1h-5a4 4 0 00-4 4v17"
      ></path>
      <path
        stroke="#354CD0"
        strokeWidth="2"
        d="M158.135 10.756L164.135 10.756"
      ></path>
      <path
        stroke="#354CD0"
        strokeWidth="2"
        d="M181.635 1h-5a4 4 0 00-4 4v13a4 4 0 004 4h5"
      ></path>
      <path
        stroke="#354CD0"
        strokeWidth="2"
        d="M172.635 11.053L181.635 11.053"
      ></path>
      <path
        stroke="#354CD0"
        strokeWidth="2"
        d="M128.478 1h-7.5a4 4 0 00-4 4v2.678a4 4 0 004 4h3a4 4 0 014 4V18a4 4 0 01-4 4h-7.5"
      ></path>
      <defs>
        <linearGradient
          id={id}
          x1="55.157"
          x2="55.157"
          y1="1"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#354CD0"></stop>
          <stop offset="1" stopColor="#AA50A8"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

const LogoSymbolIcon: FC<TLogoSymbolIconProps> = ({ className }) => {
  return (
    <svg className={className} fill="none" viewBox="0 0 22 21">
      <path
        fill="url(#paint0_linear_103_386)"
        fillRule="evenodd"
        d="M20.937 15.008C19.17 18.552 15.384 21 11 21 4.925 21 0 16.299 0 10.5c0-1.349.266-2.638.752-3.823L2.477 8.1a5.604 5.604 0 011.946 3.24c.623 3.164 3.24 5.593 6.558 6.087l1.272.19a10.31 10.31 0 007.307-1.67l1.377-.938zm.956-3.037l-3.5 2.386a8.183 8.183 0 01-5.8 1.325l-1.271-.19c-2.476-.369-4.428-2.18-4.893-4.54a7.512 7.512 0 00-2.608-4.343l-.769-.634.507.14A7.076 7.076 0 016.94 8.21a9.093 9.093 0 006.45 3.005l.256.009a10.04 10.04 0 006.42-2.033l1.613-1.22a10.073 10.073 0 01.214 4zM11 0C7.612 0 4.582 1.462 2.564 3.761l1.567.435a9.04 9.04 0 014.32 2.675A7.117 7.117 0 0013.5 9.223l.255.01a7.994 7.994 0 005.111-1.62l2.09-1.582C19.199 2.467 15.402 0 11 0z"
        clipRule="evenodd"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_103_386"
          x1="11"
          x2="11"
          y1="0"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#354CD0"></stop>
          <stop offset="1" stopColor="#AA50A8"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export { LogoIcon, LogoSymbolIcon };


