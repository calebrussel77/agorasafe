import {
  type DateInput,
  type LocationInput,
  type PhoneInput,
} from '@/validations';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const publishServiceRequestStorageName = 'service_request_form';

export type PublishServiceRequestFormStore = {
  title: string;
  description: string;
  phoneToContact: PhoneInput;
  photos: Array<{ key: string; url: string; name: string }>;
  numberOfProviderNeeded?: number;
  willWantProposal?: boolean;
  nbOfHours: number;
  date: DateInput;
  startHour: number;
  estimatedPrice: number;
  location: LocationInput;
  serviceSlug: string;
  categorySlug: string;
};

export type PublishServiceRequest = {
  serviceRequest: Record<
    string,
    Partial<PublishServiceRequestFormStore>
  > | null;
};

// define types for state values and actions separately
export type State = PublishServiceRequest | null;

type Actions = {
  updateServiceRequest: (
    serviceRequestData: Partial<PublishServiceRequestFormStore>,
    categorySlug: string
  ) => void;
  reset: () => void;
};

// define the initial state
const initialState: State = { serviceRequest: null };

type PublishServiceRequestStore = State & Actions;

export const initialStateJSON = JSON.stringify(initialState);

export const initializePublishServiceRequestStore = (
  preloadedState: Partial<PublishServiceRequestStore> = {}
) =>
  create<PublishServiceRequestStore>()(
    persist(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      set => ({
        ...initialState,
        ...preloadedState,
        updateServiceRequest: (
          serviceRequestData: Partial<PublishServiceRequestFormStore>,
          categorySlug: string
        ) =>
          set(state => {
            // Ensure that the original state is not mutated
            const newState = { ...state };

            // Check if serviceRequest exists, and if not, create an empty object
            newState.serviceRequest = newState.serviceRequest || {};

            // Create a new nested object by copying the original data and updating the specified key
            newState.serviceRequest[categorySlug] = {
              ...newState.serviceRequest[categorySlug],
              ...serviceRequestData,
              categorySlug,
            };

            return newState;
          }),
        reset: () => set(initialState),
      }),
      {
        name: publishServiceRequestStorageName,
      }
    )
  );

export const usePublishServiceRequest = () => {
  const state = initializePublishServiceRequestStore().getState();
  return state;
};
