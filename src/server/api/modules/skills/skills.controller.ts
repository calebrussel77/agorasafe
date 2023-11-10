import { throwDbError } from '@/server/utils/error-handling';

import { getSkills } from './skills.repository';

export const getSkillsHandler = async () => {
  try {
    return await getSkills();
  } catch (e) {
    throw throwDbError(e);
  }
};
