# Embedded application

Date: 2021-10-19

## Status

2021-10-19 Accepted

## Context

While signals/front-end is a React web app, the client wants to provide it to mobile app users as well.

Furthermore, some changes are requested specifically for the 'app version':

- The application header should be hidden
- The button 'Doe een melding' should be replaced with a 'Sluit venster' button which closes the window
- The possibility to initialize the map center location

The above requirements are described in more detail in [Jira](https://datapunt.atlassian.net/browse/SIG-3933).

At this moment, rebuilding the frontend in a native app architecture is not possible due to time and financial constraints.

## Decision

Add a feature flag `appMode` to the application configuration, and deploy the application with `appMode=true` to a separate domain.
Using the feature flag, the application conditionally applies the app-specific requirements.

The mobile app embeds the web app (e.g. using [React Native WebView](https://github.com/react-native-webview/react-native-webview)),
and provides additional information via query parameters (e.g. map coordinates).
Conversely, communication from the web-app to the mobile app occurs via the `postMessage()` API, but its use should be limited.
Because an embedded application cannot close itself, the `postMessage()` can be used to notify the app that it should be closed.

## Consequences

- Possibility to embed the web app in a different application/framework
- The application is deployed to an additional domain
- Addition of conditional features increase application complexity
