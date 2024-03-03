import { useEffect, useRef } from 'react';

import { type AddViewInput } from '@/validations/track.validations';

import { api } from '@/utils/api';

export function TrackView({
  type,
  entityType,
  entityId,
  details,
}: AddViewInput) {
  const trackMutation = api.track.addView.useMutation();
  const observedEntityId = useRef<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (entityId !== observedEntityId.current) {
        observedEntityId.current = entityId;
        trackMutation.mutate({
          type,
          entityType,
          entityId,
          details,
        });
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [entityId, type, entityType, details]);

  return null;
}
