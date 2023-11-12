import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Smile } from 'lucide-react';
import React, { type FC } from 'react';

import { cn } from '@/lib/utils';

import { Popover } from '../ui/popover';

interface EmojiPickerProps {
  className?: string;
  onChange: (emoji: string) => void;
  onTriggerClick?: (event: React.MouseEvent) => void;
  open?: boolean;
  onOpenChange?: () => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({
  className,
  onChange,
  onTriggerClick,
  open,
  onOpenChange,
}) => {
  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <Popover.Trigger
        onClick={onTriggerClick}
        title="Rajouter un émoji"
        aria-label="Cliquez pour rajouter un émoji"
        className="rounded-full p-1 hover:bg-gray-100"
      >
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
