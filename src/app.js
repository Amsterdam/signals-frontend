// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { Suspense } from 'react'

import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import * as Sentry from '@sentry/browser'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HistoryRouter as Router } from 'redux-first-history/rr6'

import LoadingIndicator from 'components/LoadingIndicator'
import App from 'containers/App'
import { authenticateUser } from 'containers/App/actions'
import loadModels from 'models'
import { authenticate } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'

// Import root app

// Import translations
import 'shared/services/i18n/i18n'

// Import CSS and Global Styles
import './global.css'
import './polyfills'
import './fonts.css'

import configureStore from './configureStore'
import { createPiwikInstance } from './hooks/useAnalytics'

const environment = process.env.BUILD_ENV
const dsn = configuration?.sentry?.dsn
const connectionString = configuration?.azure?.connectionString
const release = process.env.FRONTEND_TAG

if (dsn) {
  Sentry.init({
    environment,
    dsn,
    release,
    autoSessionTracking: false,
  })
}

if (connectionString) {
  const appInsights = new ApplicationInsights({
    config: { connectionString },
  })
  appInsights.loadAppInsights()
}

// Create redux store with history
const initialState = {}
const { store, history: reduxHistory } = configureStore(initialState)
const MOUNT_NODE = document.getElementById('app')

loadModels(store)

const render = () => {
  const domainTag = process.env.DOMAIN_TAG
  const tags = [
    release && `frontend tag: ${release}`,
    domainTag && `domain tag: ${domainTag}`,
  ].filter(Boolean)

  // eslint-disable-next-line no-console
  if (tags.length > 0) console.log(tags.join('\n'))

  const spinner = document.getElementById('spinner')
  const spinnerBackground = document.getElementById('spinner-background')
  spinner.remove()
  spinnerBackground.remove()

  // Create Piwik instance if on acc or prod
  createPiwikInstance(
    location.hostname !== 'localhost' && location.hostname !== '127.0.0.1'
  )

  ReactDOM.render(
    <Provider store={store}>
      <Router history={reduxHistory}>
        <Suspense fallback={<LoadingIndicator />}>
          <App />
        </Suspense>
      </Router>
    </Provider>,
    MOUNT_NODE
  )
}

const registerServiceWorkerProxy = () => {
  if ('serviceWorker' in navigator && process.env.PROXY) {
    navigator.serviceWorker.register('/sw-proxy.js')
  }
}

const unregisterServiceWorkers = () => {
  // Removes legacy service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister()
      }
    })
  }
}

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept()
}

// Authenticate and start the authorization process
authenticate()
  .then((credentials) => store.dispatch(authenticateUser(credentials)))
  .finally(() => {
    render()

    unregisterServiceWorkers()
    registerServiceWorkerProxy()
  })
  .catch(() => {})
