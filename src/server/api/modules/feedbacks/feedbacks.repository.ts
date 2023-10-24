import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

import { type GetAllQueryInput } from '../../validations/base.validations';
import { type CreateFeedBackFormInput } from './feedbacks.validations';

export const createFeedback = ({
  inputs,
}: {
  inputs: CreateFeedBackFormInput;
}) => {
  const { content, type, imageUrl } = inputs;
  return prisma.feedback.create({
    data: {
      content,
      imageUrl,
      type,
    },
  });
};

export const getAllFeedbacks = ({ inputs }: { inputs: GetAllQueryInput }) => {
  const { limit, page, query } = inputs;

  const skip = page ? (page - 1) * limit : undefined;

  let OR: Prisma.FeedbackWhereInput[] | undefined = undefined;

  if (query) OR = [{ content: { contains: query } }];

  return prisma.feedback.findMany({
    where: { OR },
    take: limit,
    skip,
  });
};
