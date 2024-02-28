import dynamic from 'next/dynamic';
import { type ComponentProps, type ComponentType } from 'react';
import { type UrlObject } from 'url';

const ReviewFormModal = dynamic(() =>
  import('@/features/reviews').then(el => el.ReviewFormModal)
);

type Url = UrlObject | string;
type DialogItem<T> = {
  requireAuth?: boolean;
  component: ComponentType<T>;
  resolve: (
    query: Record<string, unknown>,
    args: ComponentProps<ComponentType<T>>
  ) => {
    query: Record<string, unknown>;
    asPath?: Url;
    state?: Record<string, unknown>;
  };
};
type DialogRegistry<T extends Record<string, any>> = {
  [K in keyof T]: DialogItem<T[K]>;
};

function createDialogDictionary<T extends Record<string, unknown>>(
  dictionary: DialogRegistry<T>
): DialogRegistry<T> {
  return dictionary;
}

export const dialogs = createDialogDictionary({
  reviewForm: {
    component: ReviewFormModal,
    resolve: (query, { reviewId, profileId, ...rest }) => ({
      query: { ...query, reviewId, profileId },
      state: { reviewId, profileId, ...rest },
    }),
  },
  // postDetail: {
  //   component: PostDetailModal,
  //   resolve: (query, { postId }) => ({
  //     query: { ...query, postId },
  //     asPath: `/posts/${postId}`,
  //   }),
  // },
  // collectionEdit: {
  //   component: CollectionEditModal,
  //   resolve: (query, { collectionId }) => ({
  //     query: { ...query, collectionId },
  //   }),
  // },
  // hiddenModelComments: {
  //   component: HiddenCommentsModal,
  //   resolve: (query, { modelId }) => ({
  //     query: { ...query, modelId },
  //   }),
  // },
  // review: {
  //   component: ReviewModal,
  //   resolve: (query, { reviewId }) => ({
  //     query: { ...query, reviewId },
  //   }),
  // },
  // filesEdit: {
  //   component: FilesEditModal,
  //   resolve: (query, { modelVersionId }) => ({
  //     query: { ...query, modelVersionId },
  //   }),
  // },
  // commentEdit: {
  //   component: CommentEditModal,
  //   resolve: (query, { commentId }) => ({
  //     query: { ...query, commentId },
  //   }),
  // },
  // commentThread: {
  //   component: CommentThreadModal,
  //   resolve: (query, { commentId, highlight }) => ({
  //     query: { ...query, commentId, highlight },
  //   }),
  // },
});
