/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */


// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import moment from 'moment';
import 'moment/src/locale/nl';
import createHistory from 'history/createBrowserHistory';
import 'leaflet/dist/leaflet';


// Import root app
import App from 'containers/App';
import { authenticateUser } from 'containers/App/actions';
import { authenticate } from 'shared/services/auth/auth';

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
import 'static/nlmaps.css';
import 'stijl/dist/css/ams-stijl.css';
import './global.scss';

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// load locale for date formatting
moment.locale('nl');

// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

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

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'acceptance') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}

// Authenticate and start the authorization process
const credentials = authenticate();
store.dispatch(authenticateUser(credentials));

