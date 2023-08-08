import { type NextApiRequest, type NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { deleteSessionsByUserId } from '@/server/api/modules/sessions';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession();

    if (!session) {
      return res.status(200).json({ success: true });
    }

    const result = await deleteSessionsByUserId(session?.user?.id);

    return res.status(200).json({ result, isExpired: true, success: true });
  } catch (err) {
    return res.status(500).json({ error: "Une erreur s'est produite !" });
  }
};

export default handler;
