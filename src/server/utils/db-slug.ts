import { makeRandomId } from '../../utils/misc';
import { slugit } from '../../utils/strings';
import { throwDbError } from './error-handling';

export const getDynamicDbSlug = async (
  field: string,
  queryCondition: (slug: string) => Promise<unknown>
) => {
  try {
    const slug = slugit(field);
    let uniqueSlug = slug;
    while (await queryCondition(uniqueSlug)) {
      uniqueSlug = `${slug}-${makeRandomId()}`;
    }
    return uniqueSlug;
  } catch (e) {
    throwDbError(e);
  }
};
