/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Editor } from '@tiptap/core';
import { Check, ExternalLink, Trash } from 'lucide-react';
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ActionTooltip } from '@/components/action-tooltip';

import { cn } from '@/lib/utils';

import { getUrlFromString } from '../lib/utils';

interface LinkSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LinkSelector: FC<LinkSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const [isExternal, setIsExternal] = useState(false);

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });

  const onSetLink = () => {
    const newUrl = getUrlFromString(url);
    newUrl &&
      editor
        .chain()
        .focus()
        .setLink({ href: newUrl, target: isExternal ? '_blank' : null })
        .run();
    setIsOpen(false);
    setUrl('');
    setIsExternal(false);
  };

  const handleInputKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation(); // Needed to prevent other form being triggered when pressing enter
      onSetLink();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-full flex-nowrap items-center space-x-2 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <p className="text-base">↗</p>
        <p
          className={cn(
            'whitespace-nowrap underline decoration-stone-400 underline-offset-4',
            {
              'text-blue-500': editor.isActive('link'),
            }
          )}
        >
          Lien (url)
        </p>
      </button>
      {isOpen && (
        <div className="fixed top-full z-[99999] mt-1 flex w-[275px] overflow-hidden rounded border border-stone-200 bg-white p-1 px-1 shadow-xl animate-in fade-in slide-in-from-top-1">
          <input
            ref={inputRef}
            value={url}
            onChange={e => setUrl(e.target.value)}
            type="text"
            onKeyDown={handleInputKeydown}
            placeholder="Coller un lien ici..."
            className="flex-1 bg-white p-1 text-sm outline-none"
            defaultValue={editor.getAttributes('link')?.href || ''}
          />
          <ActionTooltip
            label={
              isExternal
                ? 'Ouvrir le lien dans un nouvel onglet'
                : 'Ouvrir le lien dans le même onglet'
            }
            side="bottom"
          >
            <button
              type="button"
              onClick={() => setIsExternal(!isExternal)}
              className={cn(
                'mr-2 flex items-center rounded-sm border border-gray-200 p-1 text-stone-600 transition-all hover:bg-stone-100',
                isExternal && 'bg-brand-100 text-brand-600'
              )}
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </ActionTooltip>
          {editor.getAttributes('link').href ? (
            <button
              type="button"
              className="flex items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setIsOpen(false);
              }}
            >
              <Trash className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSetLink}
              className="flex items-center rounded-sm p-1 text-stone-600 transition-all hover:bg-stone-100"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
