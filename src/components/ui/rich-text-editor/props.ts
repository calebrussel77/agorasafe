import { type EditorProps } from '@tiptap/pm/view';

import { cn } from '@/lib/utils';

import { startImageUpload } from './plugins/upload-images';

export const defaultEditorProps: ({
  withCommands,
  disabled,
}: {
  withCommands: boolean;
  disabled?: boolean;
}) => EditorProps = ({ withCommands, disabled }) => ({
  attributes: {
    class: cn(
      'prose-gray mt-1 flex-1 w-full scrollbar__custom overflow-y-auto max-h-[90px] prose prose-sm text-sm prose-h1:m-0 prose-h2:m-0 prose-h3:m-0 prose-p:m-0 prose-a:font-bold prose-a:text-brand-500 prose-a:no-underline prose-a:font-bold prose-a:text-brand-500 hover:prose-a:text-brand-600 hover:prose-a:underline prose-blockquote:m-0 prose-img:m-0 font-sans focus:outline-none max-w-full',
      disabled && 'cursor-not-allowed text-[#999]',
      withCommands && 'prose-lg text-base'
    ),
  },
  handleDOMEvents: {
    keydown: (_view, event) => {
      // prevent default event listeners from firing when slash command is active
      if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
        const slashCommand = document.querySelector('#slash-command');
        if (slashCommand) {
          return true;
        }
      }
    },
  },
  handlePaste: (view, event) => {
    if (
      event.clipboardData &&
      event.clipboardData.files &&
      event.clipboardData.files[0]
    ) {
      event.preventDefault();
      const file = event.clipboardData.files[0];
      const pos = view.state.selection.from;

      startImageUpload(file, view, pos);
      return true;
    }
    return false;
  },
  handleDrop: (view, event, _slice, moved) => {
    if (
      !moved &&
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files[0]
    ) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      const coordinates = view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });
      // here we deduct 1 from the pos or else the image will create an extra node
      startImageUpload(file, view, coordinates?.pos || 0 - 1);
      return true;
    }
    return false;
  },
});
