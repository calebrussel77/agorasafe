import ProgressBar from '@badrap/bar-of-progress';
import { Router } from 'next/router';

export const displayProgressBarOnRouteChange = () => {
  const progress = new ProgressBar({
    size: 4,
    className: 'bar-of-progress shadow-md',
    delay: 100,
    color: '#30389d',
  });

  // this fixes safari jumping to the bottom of the page
  // when closing the search modal using the `esc` key
  if (typeof window !== 'undefined') {
    progress.start();
    progress.finish();
  }

  Router.events.on('routeChangeStart', progress.start);
  Router.events.on('routeChangeComplete', () => {
    progress.finish();
    window.scrollTo(0, 0);
    Router.events.on('routeChangeError', progress.finish);
  });
};
