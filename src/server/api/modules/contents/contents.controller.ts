/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { readFile } from 'fs/promises';
//@ts-ignore
import matter from 'gray-matter';
import { join, resolve } from 'path';

import {
  throwBadRequestError,
  throwNotFoundError,
} from '@/server/utils/error-handling';

import { type ContentSlug } from './contents.validations';

const contentRoot = 'src/static-content';

export async function getContentHandler({
  input: { slug },
}: {
  input: ContentSlug;
}) {
  // Confirm path
  const filePath = join(contentRoot, ...slug) + '.md';
  const resolvedPath = resolve(filePath);

  if (!resolvedPath.startsWith(resolve(contentRoot)))
    throw throwBadRequestError('Slug invalide !');

  // Read file
  try {
    const fileContent = await readFile(resolvedPath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    return {
      title: frontmatter?.title as string,
      description: frontmatter?.description as string,
      content,
    };
  } catch {
    throw throwNotFoundError('Not found');
  }
}
