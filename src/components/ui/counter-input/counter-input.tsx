import { Minus, Plus } from 'lucide-react';
import React, { type FC, useEffect, useState } from 'react';

import { noop } from '@/utils/misc';
import { formatNumberToText } from '@/utils/text';

import { cn } from '@/lib/utils';

import { Button } from '../button';
import { Typography } from '../typography';

export interface CounterInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'step' | 'onChange'
  > {
  className?: string;
  variant?: 'hours' | 'number';
  step?: number;
  onChange: (value: number | string) => void;
}

const CounterInput: FC<CounterInputProps> = ({
  onChange,
  value = 1,
  className,
  variant = 'hours',
  step = 0.5,
  ...rest
}) => {
  const [count, setCount] = useState<number>(Number(value));

  const isMoreThanOne = count > 1;
  const isLessThanSeventeen = count < 15;

  const inCrement = () =>
    isLessThanSeventeen ? setCount(prev => Number(prev + step)) : noop;
  const deCrement = () =>
    isMoreThanOne ? setCount(prev => Number(prev - step)) : noop;

  useEffect(() => {
    onChange(count);
  }, [count]);

  useEffect(() => {
    setCount(Number(value));
  }, [value]);

  return (
    <div
      className={cn(
        'flex w-full max-w-[200px] items-center justify-between rounded-md border bg-white p-2 shadow-md',
        className
      )}
    >
      <Button
        disabled={!isMoreThanOne}
        onClick={deCrement}
        type="button"
        size="sm"
        className="rounded-md"
      >
        <Minus className="h-5 w-5" />
      </Button>
      <Typography as="h3">{formatNumberToText(count, variant)}</Typography>
      <input
        type="number"
        readOnly
        value={count}
        className="sr-only"
        {...rest}
      />
      <Button
        disabled={!isLessThanSeventeen}
        onClick={inCrement}
        size="sm"
        type="button"
        className="rounded-md"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
};

export { CounterInput };
