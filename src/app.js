/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import moment from 'moment';
import 'moment/src/locale/nl';
import * as Sentry from '@sentry/browser';
import MatomoTracker from '@datapunt/matomo-tracker-js';
import Immutable from 'immutable';
import history from 'utils/history';

// Import root app
import App from 'containers/App';
import { authenticateUser } from 'containers/App/actions';
import { authenticate } from 'shared/services/auth/auth';
import loadModels from 'models';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

/* eslint-disable import/no-webpack-loader-syntax */
import '!file-loader?name=[name].[ext]!./images/favicon.png';
/* eslint-enable import/no-webpack-loader-syntax */

// Import CSS and Global Styles
import 'amsterdam-stijl/dist/css/ams-stijl.css';
import './global.scss';
import './polyfills';

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

const environment = process.env.NODE_ENV;
const release = process.env.GIT_COMMIT;

Sentry.init({
  environment,
  dsn: 'https://3de59e3a93034a348089131aa565bdf4@sentry.data.amsterdam.nl/27',
  release,
});

// load locale for date formatting
moment.locale('nl');

// Create redux store with history
const initialState = Immutable.Map();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

loadModels(store);

// Setup Matomo
const hostname = window && window.location && window.location.hostname;
const MatomoInstance = new MatomoTracker({
  urlBase: 'https://analytics.data.amsterdam.nl/',
  siteId: hostname === 'meldingen.amsterdam.nl' ? 13 : 14,
});

MatomoInstance.trackPageView();

const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </LanguageProvider>
    </Provider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() =>
      Promise.all([
        import('intl/locale-data/jsonp/en.js'),
        import('intl/locale-data/jsonp/nl.js'),
      ])
    )
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Authenticate and start the authorization process
const credentials = authenticate();
store.dispatch(authenticateUser(credentials));

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  const runtime = require('offline-plugin/runtime');

  runtime.install({
    onUpdateReady: () => {
      runtime.applyUpdate();
    },
  });
}
