import { NotFound } from '@/layouts/not-found';

export default function NotFoundPage() {
  // Opinionated: do not record an exception in Sentry for 404
  return <NotFound />;
}

NotFoundPage.shouldDisableAnalytics = true;
