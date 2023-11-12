import {
  Editor,
  EditorContent,
  type EditorContentProps,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useImperativeHandle, useRef } from 'react';

import { getVariantBorderColor } from '@/utils/variants';

import { cn } from '@/lib/utils';

import { InputProps } from '../input';

export type EditorCommandsRef = {
  insertContentAtCursor: (value: string) => void;
  focus: () => void;
};

type ControlType =
  | 'heading'
  | 'formatting'
  | 'list'
  | 'link'
  | 'media'
  | 'mentions'
  | 'polls'
  | 'colors';

type Props = Omit<EditorContentProps, 'editor' | 'children' | 'onChange'> &
  Pick<
    InputProps,
    'className' | 'variant' | 'iconBefore' | 'iconAfter' | 'required'
  > & {
    value?: string;
    includeControls?: ControlType[];
    onChange?: (value: string) => void;
    disabled?: boolean;
    hideToolbar?: boolean;
    editorSize?: 'sm' | 'md' | 'lg' | 'xl';
    reset?: number;
    autoFocus?: boolean;
    defaultSuggestions?: Array<{ id: number; label: string }>;
    innerRef?: React.ForwardedRef<EditorCommandsRef>;
    onSuperEnter?: () => void;
    withLinkValidation?: boolean;
    stickyToolbar?: boolean;
    toolbarOffset?: number;
  };

const RichTextEditor = ({
  id,
  className,
  variant,
  iconBefore,
  iconAfter,
  required,
  placeholder,
  value,
  onChange,
  includeControls = ['formatting'],
  disabled = false,
  hideToolbar = false,
  editorSize = 'sm',
  reset = 0,
  autoFocus,
  defaultSuggestions,
  innerRef,
  onSuperEnter,
  withLinkValidation,
  stickyToolbar,
  toolbarOffset = 70,
  ref,
  ...props
}: Props) => {
  const withHeading = includeControls.includes('heading');
  const withFormatting = includeControls.includes('formatting');
  const withList = includeControls.includes('list');
  const withLink = includeControls.includes('link');
  const withMedia = includeControls.includes('media');
  const withMentions = includeControls.includes('mentions');
  const withPolls = includeControls.includes('polls');

  const editorRef = useRef<Editor>();

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: onChange ? ({ editor }) => onChange(editor.getHTML()) : undefined,
    editable: !disabled,
  });

  // To clear content after a form submission
  useEffect(() => {
    if (!value && editor) editor.commands.clearContent();
  }, [editor, value]);

  useEffect(() => {
    if (reset > 0 && editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [reset]); //eslint-disable-line

  useEffect(() => {
    if (editor && autoFocus)
      editor.commands.focus('end', { scrollIntoView: true });
  }, [editor, autoFocus]);

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

  return (
    <EditorContent
      {...props}
      ref={ref as never}
      className={cn(
        'flex h-10 w-full rounded-sm border border-input bg-transparent px-3 py-2 text-sm ring-offset-background transition duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variant && getVariantBorderColor(variant)
      )}
      id={id}
      editor={editor}
    />
  );
};

export { RichTextEditor };
