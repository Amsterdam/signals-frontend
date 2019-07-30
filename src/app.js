/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';
import 'url-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import moment from 'moment';
import 'moment/src/locale/nl';
import { createBrowserHistory } from 'history';
import 'leaflet/dist/leaflet';
import * as Sentry from '@sentry/browser';


// Import root app
import App from 'containers/App';
import { authenticateUser } from 'containers/App/actions';
import { authenticate } from 'shared/services/auth/auth';
import loadModels from 'models';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-webpack-loader-syntax */
import '!file-loader?name=[name].[ext]!./images/favicon.png';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess'; // eslint-disable-line import/extensions
/* eslint-enable import/no-webpack-loader-syntax */

// Import CSS and Global Styles
import 'leaflet/dist/leaflet.css';
import 'amsterdam-amaps/dist/nlmaps/dist/assets/css/nlmaps.css';
import 'amsterdam-stijl/dist/css/ams-stijl.css';
import './global.scss';

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
const initialState = {};
const history = createBrowserHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

loadModels(store);

const render = (messages) => {
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
  (new Promise((resolve) => {
    resolve(import('intl'));
  }))
    .then(() => Promise.all([
      import('intl/locale-data/jsonp/en.js'),
      import('intl/locale-data/jsonp/nl.js'),
    ]))
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Authenticate and start the authorization process
const credentials = authenticate();
store.dispatch(authenticateUser(credentials));
