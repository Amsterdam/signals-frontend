import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import * as Sentry from '@sentry/browser';
import MatomoTracker from '@datapunt/matomo-tracker-js';
import Immutable from 'immutable';
import history from 'utils/history';

// Import root app
import App from 'containers/App';
import { authenticateUser } from 'containers/App/actions';
import { authenticate } from 'shared/services/auth/auth';
import configuration from 'shared/services/configuration/configuration';
import loadModels from 'models';

// eslint-disable-next-lin import/no-webpack-loader-syntax
import '!file-loader?name=[name].[ext]!./images/favicon.png';

// Import CSS and Global Styles
import './global.scss';
import './polyfills';

import configureStore from './configureStore';

const environment = process.env.NODE_ENV;

try {
  const dsn = configuration?.sentry?.dsn;
  const release = process.env.GIT_COMMIT;
  if (dsn) {
    Sentry.init({
      environment,
      dsn,
      release,
    });
  }
} catch (error) {
  // noop
}


// Create redux store with history
const initialState = Immutable.Map();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

loadModels(store);

// Setup Matomo
try {
  const urlBase = configuration?.matomo?.urlBase;
  const siteId = configuration?.matomo?.siteId;

  if (urlBase && siteId) {
    const MatomoInstance = new MatomoTracker({
      urlBase,
      siteId,
    });
    MatomoInstance.trackPageView();
  }
} catch (error) {
  // noop
}

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render();
  });
}

render();

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

if ('serviceWorker' in navigator && process.env.PROXY) {
  navigator.serviceWorker.register('/sw-proxy.js');
}
