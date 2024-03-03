import {
  type TrackActionInput,
  type TrackSearchInput,
  type TrackShareInput,
} from '@/validations/track.validations';

import { api } from '@/utils/api';

export const useTrackEvent = () => {
  const { mutateAsync: trackShare } = api.track.trackShare.useMutation();
  const { mutateAsync: trackAction } = api.track.addAction.useMutation();
  const { mutateAsync: trackSearch } = api.track.trackSearch.useMutation();

  const handleTrackShare = (data: TrackShareInput) => {
    return trackShare(data);
  };

  const handleTrackAction = (data: TrackActionInput) => {
    return trackAction(data);
  };

  const handleTrackSearch = (data: TrackSearchInput) => {
    return trackSearch(data);
  };

  return {
    trackShare: handleTrackShare,
    trackAction: handleTrackAction,
    trackSearch: handleTrackSearch,
  };
};
