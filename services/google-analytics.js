import ReactGA from 'react-ga';
import Router from 'next/router';

require('dotenv').config();

export const initGA = () => {
  ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID);
};

export const logPageView = () => {
  ReactGA.set({ page: Router.router.asPath });
  ReactGA.pageview(Router.router.asPath);
};

export const logEvent = (category, action) => {
  ReactGA.event({ category, action });
};
