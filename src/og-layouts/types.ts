import { type GenericOgInput } from './generic-og';
import { type PublicProfileOgInput } from './public-profile-og';
import { type ServiceRequestOgInput } from './service-request-og';

export type ImageParamsMap = {
  generic: GenericOgInput;
  serviceRequest: ServiceRequestOgInput;
  publicProfile: PublicProfileOgInput;
};
