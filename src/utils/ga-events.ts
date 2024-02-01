import { isProd } from '@/constants';
import { event } from 'nextjs-google-analytics';

export type EventActions = 'cta-click' | 'feedback-submission';
export type EventCategories = 'Contact' | 'CTA';

type GaTrackEventProps = Prettify<
  Parameters<typeof event>[1] & {
    category: EventCategories;
    message: string;
  }
>;

export const gaTrackEvent = (
  eventName: EventActions,
  { category, message }: GaTrackEventProps
) => {
  if (!isProd) return null;
  event(eventName, {
    category,
    label: message,
  });
};
