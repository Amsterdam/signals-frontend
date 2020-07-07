import React from 'react';
import ReactDOM from 'react-dom';

import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import * as Sentry from '@sentry/browser';
import MatomoTracker from '@datapunt/matomo-tracker-js';
import Immutable from 'immutable';
import history from 'utils/history';

import {
  createClient as createUrqlClient,
  Provider as UrqlProvider,
  dedupExchange,
  fetchExchange,
} from 'urql';

import { cacheExchange } from '@urql/exchange-graphcache';
// import { relayPagination } from '@urql/exchange-graphcache/extras';

import { devtoolsExchange } from '@urql/devtools';

// Import root app
import App from 'containers/App';
import { authenticateUser } from 'containers/App/actions';
import { authenticate } from 'shared/services/auth/auth';
import configuration from 'shared/services/configuration/configuration';
import loadModels from 'models';
import graphQlSchema from '../graphql/schema.json';

// Make sure these icons are picked up by webpack
/* eslint-disable import/no-unresolved,import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.png';
import '!file-loader?name=[name].[ext]!./images/icon_180x180.png';
import '!file-loader?name=[name].[ext]!./images/icon_192x192.png';
/* eslint-enable import/no-unresolved,import/extensions */

// Import CSS and Global Styles
import './global.scss';
import './polyfills';

import configureStore from './configureStore';

const environment = process.env.NODE_ENV;

const dsn = configuration?.sentry?.dsn;
const release = process.env.GIT_COMMIT;
if (dsn) {
  Sentry.init({
    environment,
    dsn,
    release,
  });
}

// Create redux store with history
const initialState = Immutable.Map();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

loadModels(store);

// Setup Matomo
const urlBase = configuration?.matomo?.urlBase;
const siteId = configuration?.matomo?.siteId;

if (urlBase && siteId) {
  const MatomoInstance = new MatomoTracker({
    urlBase,
    siteId,
  });
  MatomoInstance.trackPageView();
}

// Setup urql exchanges
const exchanges = [
  dedupExchange,
  cacheExchange({
    schema: graphQlSchema,
    // resolvers: {
    //   Query: {
    //     categories: relayPagination(),
    //   },
    // },
  }),
  fetchExchange,
];

if (process.env.NODE_ENV !== 'production') exchanges.unshift(devtoolsExchange);

const render = () => {
  // eslint-disable-next-line no-undef,no-console
  console.log(`Signals: version: ${VERSION}, build: ${process.env.NODE_ENV}`);

  const urqlClient = createUrqlClient({ url: configuration.GRAPHQL_ENDPOINT, exchanges });

  ReactDOM.render(
    <ReduxProvider store={store}>
      <UrqlProvider value={urqlClient}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </UrqlProvider>
    </ReduxProvider>,
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
