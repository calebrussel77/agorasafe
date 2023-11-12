/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { InputRule } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TiptapImage from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import TiptapUnderline from '@tiptap/extension-underline';
import { Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

import UploadImagesPlugin from '../plugins/upload-images';
import CustomKeymap from './custom-keymap';
import DragAndDrop from './drag-and-drop';
import SlashCommand from './slash-command';
import UpdatedImage from './updated-image';

type DefaultExtensionsProps = {
  withFormatting: boolean;
  withList: boolean;
  withMedia: boolean;
  withMentions: boolean;
  withCommands: boolean;
  withColors: boolean;
  withTaskList: boolean;
  placeholder: string | undefined;
  onSuperEnter?: () => void;
};

export const defaultExtensions = ({
  withFormatting,
  withList,
  withTaskList,
  withMedia,
  withMentions,
  withCommands,
  withColors,
  placeholder,
  onSuperEnter,
}: DefaultExtensionsProps) => {
  return [
    StarterKit.configure({
      bulletList: !withList
        ? false
        : {
            HTMLAttributes: {
              class: 'list-disc list-outside leading-3 -mt-2',
            },
          },
      orderedList: !withList
        ? false
        : {
            HTMLAttributes: {
              class: 'list-decimal list-outside leading-3 -mt-2',
            },
          },
      listItem: !withList
        ? false
        : {
            HTMLAttributes: {
              class: 'leading-normal -mb-2',
            },
          },
      bold: !withFormatting ? false : undefined,
      italic: !withFormatting ? false : undefined,
      strike: !withFormatting ? false : undefined,
      code: !withFormatting
        ? false
        : {
            HTMLAttributes: {
              class:
                'rounded-md bg-gray-200 px-1.5 py-1 font-mono font-medium text-gray-900',
              spellcheck: 'false',
            },
          },
      blockquote: !withFormatting
        ? false
        : {
            HTMLAttributes: {
              class: 'border-l-4 border-gray-700',
            },
          },
      codeBlock: !withFormatting
        ? false
        : {
            HTMLAttributes: {
              class:
                'rounded-sm bg-gray-100 p-5 font-mono font-medium text-gray-800',
            },
          },
      horizontalRule: false,
      dropcursor: {
        color: '#DBEAFE',
        width: 4,
      },
      gapcursor: false,
    }),
    Placeholder.configure({
      placeholder: placeholder
        ? placeholder
        : ({ node }) => {
            if (node.type.name === 'heading') {
              return `Titre ${node.attrs.level}`;
            }
            return "Appuyer sur la touche '/' pour voir les commandes...";
          },
      includeChildren: !placeholder,
    }),
    ...(onSuperEnter
      ? [
          Extension.create({
            name: 'onSubmitShortcut',
            addKeyboardShortcuts: () => ({
              'Mod-Enter': () => {
                onSuperEnter();
                return true; // Dunno why they want a boolean here
              },
            }),
          }),
        ]
      : []),

    // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
    HorizontalRule.extend({
      addInputRules() {
        return [
          new InputRule({
            find: /^(?:---|—-|___\s|\*\*\*\s)$/,
            handler: ({ state, range }) => {
              const attributes = {};

              const { tr } = state;
              const start = range.from;
              const end = range.to;

              tr.insert(start - 1, this.type.create(attributes)).delete(
                tr.mapping.map(start),
                tr.mapping.map(end)
              );
            },
          }),
        ];
      },
    }).configure({
      HTMLAttributes: {
        class: 'mt-4 mb-6 border-t border-gray-300',
      },
    }),
    TiptapLink.configure({
      HTMLAttributes: {
        class:
          'underline-offset-[3px] underline text-brand-600 transition-colors cursor-pointer',
      },
    }),
    ...(withMedia
      ? [
          TiptapImage.extend({
            addProseMirrorPlugins() {
              return [UploadImagesPlugin()];
            },
          }).configure({
            allowBase64: true,
            HTMLAttributes: {
              class: 'rounded-lg border border-gray-200',
            },
          }),
          // UpdatedImage.configure({
          //   HTMLAttributes: {
          //     class: 'rounded-lg border border-gray-200',
          //   },
          // }),
        ]
      : []),
    ...(withFormatting ? [TiptapUnderline] : []),
    ...(withCommands ? [SlashCommand] : []),
    ...(withColors ? [TextStyle, Color] : []),
    Highlight.configure({
      multicolor: true,
    }),
    ...(withTaskList
      ? [
          TaskList.configure({
            HTMLAttributes: {
              class: 'not-prose pl-2',
            },
          }),
          TaskItem.configure({
            HTMLAttributes: {
              class: 'flex items-start my-4',
            },
            nested: true,
          }),
        ]
      : []),
    Markdown.configure({
      // html: false,
      transformCopiedText: true,
      transformPastedText: true,
    }),
    CustomKeymap,
    ...(withCommands ? [DragAndDrop] : []),
  ];
};
