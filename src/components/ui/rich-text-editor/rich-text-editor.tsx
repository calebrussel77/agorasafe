/* eslint-disable @typescript-eslint/no-floating-promises */

/* eslint-disable @typescript-eslint/naming-convention */
import { type Extensions } from '@tiptap/core';
import { type EditorProps } from '@tiptap/pm/view';
import {
  EditorContent,
  type EditorContentProps,
  type JSONContent,
  type Editor as TipTapEditor,
  useEditor,
} from '@tiptap/react';
import {
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { EmojiPicker } from '@/components/emoji-picker';

import { type SizeVariant } from '@/utils/variants';

import { cn } from '@/lib/utils';

import { AutoAnimate } from '../auto-animate';
import { Field, type FieldProps } from '../field';
import { EditorBubbleMenu } from './bubble-menu';
import { defaultExtensions } from './extensions';
import { ImageResizer } from './extensions/image-resizer';
import { defaultEditorProps } from './props';
import { NovelContext } from './provider';

const mapEditorSizeHeight: Omit<Record<SizeVariant, string>, 'xs' | 'xxl'> = {
  sm: 'min-h-[40px]',
  md: 'min-h-[75px]',
  lg: 'min-h-[95px]',
  xl: 'min-h-[110px]',
};

export function Editor({
  className,
  classNames,
  extensions = [],
  editorProps = {},
  onChange = () => {},
  innerRef,
  placeholder,
  reset = 0,
  editorSize = 'sm',
  disabled,
  withEmoji = true,
  includeControls = ['formatting'],
  onSuperEnter,
  id,
  label,
  error,
  autoFocus = false,
  hint,
  iconRight,
  iconLeft,
  required,
  description,
  value: _value,
  ref,
  ...props
}: Props) {
  const withFormatting = includeControls.includes('formatting');
  const withList = includeControls.includes('list');
  const withTaskList = includeControls.includes('task-list');
  const withMedia = includeControls.includes('media');
  const withMentions = includeControls.includes('mentions');
  const withCommands = includeControls.includes('commands');
  const withColors = withFormatting && includeControls.includes('colors');

  const hasRightSection = withEmoji || iconRight;
  const hasLeftSection = iconLeft;

  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

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
    content: _value as string,
    onUpdate: onChange ? ({ editor }) => onChange(editor.getHTML()) : undefined,
    editable: !disabled,
  });

  const editorRef = useRef<TipTapEditor>();

  useEffect(() => {
    if (editor && !editorRef.current) editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (editor && autoFocus)
      editor.commands.focus('end', { scrollIntoView: true });
  }, [editor, autoFocus]);

  // To clear content after a form submission
  useEffect(() => {
    if (!_value && editor) editor.commands.clearContent();
  }, [editor, _value]);

  useEffect(() => {
    if (reset > 0 && editor && _value && editor.getHTML() !== _value) {
      editor.commands.setContent(_value as string);
    }
  }, [reset]); //eslint-disable-line

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
        completionApi: '',
      }}
    >
      <Field
        id={id}
        label={label}
        error={error}
        hint={hint}
        required={required}
        description={description}
        className="w-full"
      >
        <EditorContent
          {...props}
          editor={editor}
          onClick={() => {
            editor?.chain().focus().run();
          }}
          className={cn(
            'relative w-full rounded-md border border-input bg-transparent px-4 py-2 shadow-sm',
            mapEditorSizeHeight[editorSize],
            error && 'border-red-500',
            hasRightSection && 'pr-10',
            hasLeftSection && 'pl-10',
            disabled && 'cursor-not-allowed bg-gray-100',
            className,
            classNames?.root
          )}
        >
          {hasLeftSection && (
            <div
              className={cn(
                'absolute bottom-2 left-2 z-20 flex flex-nowrap items-center gap-2',
                classNames?.leftContainer
              )}
            >
              {iconLeft}
            </div>
          )}

          {editor && (
            <EditorBubbleMenu
              editor={editor}
              withColors={withColors}
              withNodeBubbleMenu={withCommands}
            />
          )}

          {editor?.isActive('image') && <ImageResizer editor={editor} />}

          <AutoAnimate
            className={cn(
              'absolute bottom-1 right-2 z-20 flex flex-nowrap items-center gap-2',
              classNames?.rightContainer
            )}
          >
            {hasRightSection && (
              <>
                <EmojiPicker
                  open={isEmojiOpen}
                  onOpenChange={() => setIsEmojiOpen(!isEmojiOpen)}
                  onTriggerClick={event => {
                    // Little hack to prevent the emoji picker from closing popover
                    // event.preventDefault();
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
                {iconRight}
              </>
            )}
          </AutoAnimate>
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

type ClassNames = {
  root: string;
  emoji: string;
  rightContainer: string;
  leftContainer: string;
};

type Props = Omit<
  EditorContentProps,
  'editor' | 'children' | 'onChange' | 'size'
> &
  Pick<FieldProps, 'hint' | 'error' | 'label' | 'description'> & {
    includeControls?: ControlType[];
    disabled?: boolean;
    withEmoji?: boolean;
    editorSize?: 'sm' | 'md' | 'lg' | 'xl';
    reset?: number;
    autoFocus?: boolean;
    defaultSuggestions?: Array<{ id: number; label: string }>;
    innerRef?: React.ForwardedRef<EditorCommandsRef>;
    onSuperEnter?: () => void;
    classNames?: Partial<ClassNames>;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
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
  };
