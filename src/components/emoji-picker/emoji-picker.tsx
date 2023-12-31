import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Smile } from 'lucide-react';
import React, { type FC } from 'react';

import { cn } from '@/lib/utils';

import { Popover } from '../ui/popover';

interface EmojiPickerProps {
  className?: string;
  onChange: (emoji: string) => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ className, onChange }) => {
  return (
    <Popover>
      <Popover.Trigger>
        <Smile className="default__transition text-zinc-500 hover:text-zinc-600" />
      </Popover.Trigger>
      <Popover.Content
        side="top"
        className={cn(
          'mb-3 min-w-[352px] rounded-lg bg-white p-0 shadow-lg',
          className
        )}
      >
        <Picker
          theme="light"
          locale="fr"
          data={data}
          previewPosition="none"
          onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
        />
      </Popover.Content>
    </Popover>
  );
};

export { EmojiPicker };
