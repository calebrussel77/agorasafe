import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const publishServiceRequestStorageName =
  '__agorasafe_publish_service_request__';

export type PublishServiceRequest = {
  title: string;
  description: string;
  phoneToContact: string;
  photoOne?: string;
  photoTwo?: string;
  photoThree?: string;
  numberOfProviderNeeded: number;
  duration?: string;
  startDate: string;
  startHour: string;
  endDate?: string;
  estimatedPrice: string;
  location: string;
};

// define types for state values and actions separately
type State = {
  serviceRequest: Partial<PublishServiceRequest> | null;
};

type Actions = {
  updateServiceRequest: (serviceRequestData: State['serviceRequest']) => void;
  reset: () => void;
};

// define the initial state
const initialState: State = {
  serviceRequest: null,
};

export const usePublishServiceRequest = create<State & Actions>()(
  persist(
    set => ({
      ...initialState,
      updateServiceRequest: (serviceRequestData: State['serviceRequest']) =>
        set(state => ({
          ...state,
          serviceRequest: { ...state.serviceRequest, ...serviceRequestData },
        })),
      reset: () => set(initialState),
    }),
    {
      name: publishServiceRequestStorageName,
      // storage: sess,
    }
  )
);
