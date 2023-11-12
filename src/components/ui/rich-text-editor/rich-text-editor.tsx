/* eslint-disable @typescript-eslint/no-floating-promises */

/* eslint-disable @typescript-eslint/naming-convention */
import { type Editor as EditorClass, type Extensions } from '@tiptap/core';
import { type Transaction } from '@tiptap/pm/state';
import { type EditorProps } from '@tiptap/pm/view';
import {
  EditorContent,
  type EditorContentProps,
  type JSONContent,
  type Editor as TipTapEditor,
  useEditor,
} from '@tiptap/react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { useDebouncedCallback } from 'use-debounce';

import { EmojiPicker } from '@/components/emoji-picker';

import { type SizeVariant } from '@/utils/variants';

import { cn } from '@/lib/utils';

import { Field, FieldProps } from '../field';
import { type InputProps } from '../input';
import { EditorBubbleMenu } from './bubble-menu';
import { defaultExtensions } from './extensions';
import { ImageResizer } from './extensions/image-resizer';
import { defaultEditorProps } from './props';
import { NovelContext } from './provider';

const mapEditorSizeHeight: Omit<Record<SizeVariant, string>, 'xs' | 'xxl'> = {
  sm: 'min-h-[30px]',
  md: 'min-h-[75px]',
  lg: 'min-h-[80px]',
  xl: 'min-h-[95px]',
};

export function Editor({
  completionApi = '/api/generate',
  className,
  defaultValue = '',
  extensions = [],
  editorProps = {},
  onChange = () => {},
  onDebouncedUpdate = () => {},
  debounceDuration = 750,
  storageKey = 'agorasafe__content',
  disableLocalStorage = false,
  innerRef,
  placeholder,
  editorSize = 'sm',
  disabled,
  withEmoji = true,
  includeControls = ['formatting'],
  onSuperEnter,
  id,
  label,
  error,
  hint,
  required,
}: Props) {
  const withFormatting = includeControls.includes('formatting');
  const withList = includeControls.includes('list');
  const withTaskList = includeControls.includes('task-list');
  const withMedia = includeControls.includes('media');
  const withMentions = includeControls.includes('mentions');
  const withCommands = includeControls.includes('commands');
  const withColors = withFormatting && includeControls.includes('colors');

  const storageKeyId = id || storageKey;
  const [content, setContent] = useLocalStorage(storageKeyId, defaultValue);

  const [hydrated, setHydrated] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const debouncedUpdates = useDebouncedCallback(
    async ({ editor }: { editor: EditorClass; transaction: Transaction }) => {
      const json = editor.getJSON();
      await onDebouncedUpdate(editor);

      if (!disableLocalStorage) {
        setContent(json as never);
      }
    },
    debounceDuration
  );

  const editor = useEditor({
    extensions: [
      ...defaultExtensions({
        withFormatting,
        withList,
        withMedia,
        withMentions,
        placeholder: !withCommands
          ? placeholder || 'Entrer votre texte...'
          : undefined,
        withColors,
        withCommands,
        withTaskList,
        onSuperEnter,
      }),
      ...extensions,
    ],
    editorProps: {
      ...defaultEditorProps({ withCommands }),
      ...editorProps,
    },
    onUpdate: e => {
      onChange(e.editor.getHTML());
      debouncedUpdates(e);
    },
    autofocus: 'end',
    editable: !disabled,
  });

  const editorRef = useRef<TipTapEditor>();

  // Default: Hydrate the editor with the content from localStorage.
  // If disableLocalStorage is true, hydrate the editor with the defaultValue.
  useEffect(() => {
    if (!editor || hydrated) return;

    const value = disableLocalStorage ? defaultValue : content;

    if (value) {
      editor.commands.setContent(value);
      setHydrated(true);
    }
  }, [editor, defaultValue, content, hydrated, disableLocalStorage]);

  useEffect(() => {
    if (editor && !editorRef.current) editorRef.current = editor;
  }, [editor]);

  // Used to call editor commands outside the component via a ref
  useImperativeHandle(innerRef, () => ({
    insertContentAtCursor: value => {
      if (editorRef.current && innerRef) {
        const currentPosition = editorRef.current.state.selection.$anchor.pos;
        editorRef.current.commands.insertContentAt(currentPosition, value);
      }
    },
    focus: () => {
      if (editorRef.current && innerRef) {
        editorRef.current.commands.focus('end');
      }
    },
  }));

  if (!editor) return null;

  return (
    <NovelContext.Provider
      value={{
        completionApi,
      }}
    >
      <Field
        id={id}
        label={label}
        error={error}
        hint={hint}
        required={required}
      >
        <EditorContent
          id={id}
          editor={editor}
          onClick={() => {
            editor?.chain().focus().run();
          }}
          className={cn(
            'relative w-full rounded-md border border-input bg-transparent px-4 py-2',
            mapEditorSizeHeight[editorSize],
            error && 'border-red-500',
            withEmoji && 'pr-10',
            className
          )}
        >
          {editor && (
            <EditorBubbleMenu
              editor={editor}
              withColors={withColors}
              withNodeBubbleMenu={withCommands}
            />
          )}
          {editor?.isActive('image') && <ImageResizer editor={editor} />}
          {withEmoji && (
            <div className="absolute bottom-1 right-2 z-20">
              <EmojiPicker
                open={isEmojiOpen}
                onOpenChange={() => setIsEmojiOpen(!isEmojiOpen)}
                onTriggerClick={event => {
                  // Little hack to prevent the emoji picker from closing popover
                  event.preventDefault();
                  event.stopPropagation();
                  editor.commands.blur();
                  setIsEmojiOpen(!isEmojiOpen);
                }}
                onChange={emoji => {
                  const currentPosition = editor.state.selection.$anchor.pos;
                  editor.commands.insertContentAt(currentPosition, emoji);
                  editor.commands.blur();
                }}
              />
            </div>
          )}
        </EditorContent>
      </Field>
    </NovelContext.Provider>
  );
}

export type EditorCommandsRef = {
  insertContentAtCursor: (value: string) => void;
  focus: () => void;
};

type ControlType =
  | 'formatting'
  | 'list'
  | 'task-list'
  | 'media'
  | 'mentions'
  | 'commands'
  | 'colors';

type Props = Omit<
  EditorContentProps,
  'editor' | 'children' | 'onChange' | 'size'
> &
  Pick<FieldProps, 'hint' | 'error' | 'label'> & {
    includeControls?: ControlType[];
    disabled?: boolean;
    withEmoji?: boolean;
    editorSize?: 'sm' | 'md' | 'lg' | 'xl';
    reset?: number;
    autoFocus?: boolean;
    defaultSuggestions?: Array<{ id: number; label: string }>;
    innerRef?: React.ForwardedRef<EditorCommandsRef>;
    onSuperEnter?: () => void;

    /**
     * The API route to use for the OpenAI completion API.
     * Defaults to "/api/generate".
     */
    completionApi?: string;
    /**
     * Additional classes to add to the editor container.
     * Defaults to "relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg".
     */
    className?: string;
    /**
     * The default value to use for the editor.
     * Defaults to defaultEditorContent.
     */
    defaultValue?: JSONContent | string;
    /**
     * A list of extensions to use for the editor, in addition to the default Novel extensions.
     * Defaults to [].
     */
    extensions?: Extensions;
    /**
     * Props to pass to the underlying Tiptap editor, in addition to the default Novel editor props.
     * Defaults to {}.
     */
    editorProps?: EditorProps;
    /**
     * A callback function that is called whenever the editor is updated.
     * Defaults to () => {}.
     */
    // eslint-disable-next-line no-unused-vars
    onChange?: (value?: string) => void;
    /**
     * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
     * Defaults to () => {}.
     */
    // eslint-disable-next-line no-unused-vars
    onDebouncedUpdate?: (editor?: EditorClass) => void | Promise<void>;
    /**
     * The duration (in milliseconds) to debounce the onDebouncedUpdate callback.
     * Defaults to 750.
     */
    debounceDuration?: number;
    /**
     * The key to use for storing the editor's value in local storage.
     * Defaults to "agorasafe__content".
     */
    storageKey?: string;
    /**
     * Disable local storage read/save.
     * Defaults to false.
     */
    disableLocalStorage?: boolean;
  };
