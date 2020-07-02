# Configuration

The application's configuration is provided by [`environment.conf.json`](../../environment.conf.json). That file contains default values that will allow you to run the application locally and to be able to deploy a Netlify build.

Instance specific configuration is, at the time of writing, provided by [`signals-amsterdam`](https://github.com/Amsterdam/signals-amsterdam) and [`signals-weesp`](https://github.com/Amsterdam/signals-weesp). During Docker build, the correct configuration is [mounted into the container](../../Dockerfile#L72).<br />
See [the `Dockerfile` in the `signals-amsterdam` repository](https://github.com/Amsterdam/signals-amsterdam/blob/develop/Dockerfile#L5).

## Properties

### head

- `androidIcon`
  PNG image in `src/images` folder. Should be an absolute URL since Webpack copies it in the web root on build.<br>
  Used in [`manifest.json`](../../src/manifest.json).

- `backgroundColor`
  Background color for the splash screen when the application is first launched on mobile.<br>
  Used in [`manifest.json`](../../src/manifest.json)

- `favicon`
  PNG image in `src/images` folder.<br>
  Used in [`index.html`](../../src/index.html).

- `iosIcon`
  PNG image in `src/images` folder.<br>
  Used in [`index.html`](../../src/index.html).

- `statusBarStyle`
  Contains value that sets the style of the status bar for the web application. See [developer.apple.com](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html#:~:text=apple%2Dmobile%2Dweb%2Dapp%2Dstatus%2Dbar%2Dstyle,-Sets%20the%20style&text=If%20set%20to%20black%20%2C%20the,displayed%20below%20the%20status%20bar.) for reference.<br>
  Used in [`index.html`](../../src/index.html).

- `themeColor`
  Value that sets the color of the tool bar, and may be reflected in the app's preview in task switchers.<br>
  Used in [`manifest.json`](../../src/manifest.json).

### logo

- `url`
  Any URL that will hold the image for the application's logo. Can be a URI or an absolute URL that points to the webroot.<br>
  Used in the [`Logo` component](../../src/components/Logo/index.js)

- `width`
  Length value that sets the logo image's width. See https://developer.mozilla.org/en-US/docs/Web/CSS/width for reference.<br>
  Used in the [`Logo` component](../../src/components/Logo/index.js)

- `height`
  Length value that sets the logo image's height.<br>
  Used in the [`Logo` component](../../src/components/Logo/index.js)

- `smallWidth`
  Length value that sets the logo image's width in case the logo is rendered in a site header with limited height.<br>
  Used in the [`Logo` component](../../src/components/Logo/index.js)

- `smallHeight`
  Length value that sets the logo image's height in case the logo is rendered in a site header with limited height.<br>
  Used in the [`Logo` component](../../src/components/Logo/index.js)

### sentry

- `dsn`
  Sentry data source name value. When omitted, Sentry will not be initialised in the application<br>
  Used in [`app.js`](../../src/app.js#L34)

### matomo

- `urlBase`
  Matomo tracker base URL. See https://www.npmjs.com/package/@datapunt/matomo-tracker-js for reference.<br>
  Used in [`app.js`](../../src/app.js#L53)

- `siteId`
  ID by which the site is tracked in Matomo.
  Used in [`app.js`](../../src/app.js#L53)

### language

- `title`
  PWA title value. See [developer.apple.com](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html#:~:text=apple%2Dmobile%2Dweb%2Dapp%2Dstatus%2Dbar%2Dstyle,-Sets%20the%20style&text=If%20set%20to%20black%20%2C%20the,displayed%20below%20the%20status%20bar.) for reference.<br>
  Used in [`index.html`](../../src/index.html).

- `shortTitle`
  PWA `short_name` property value. Should not exceed 12 characters. See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/short_name for reference<br>
  Used in [`manifest.json`](../../src/manifest.json).

- `siteTitle`
  Application title showing up in the title bar and search results.<br>
  Used in [`index.html`](../../src/index.html).

- `headerTitle`
  The title to show in the header of the application, next to the logo.

- `smallHeaderTitle`
  The title to show in the small version of the header.

- `footer1`
  Extra information to show in the footer of the application.
  
- `footer2`
  Second line of information to show in the footer of the application.

#### incidentForm

##### step5

- `consent`
  The message to ask for consent to share contact information.
  
##### step7

- `extraInfo`
  Extra information to show in case of an error.

### links

- `help`
  A website with help about the application, for employees of the municipality.

- `home`
  The home page of the website of the municipality.

- `privacy`
  The privacy statement of the municipality.

### theme

Configuration object that is merged with the application's theme provider configuration and will override any existing theme configuration. See the [amsterdam styled components theme configuration](https://github.com/Amsterdam/amsterdam-styled-components/blob/master/packages/asc-ui/src/theme/default/index.ts) for the structure of the object.<br>
Used in the [`ThemeProvider` component](../../src/components/ThemeProvider/index.js)


### map

#### tiles

- `args`
  Array of URL template strings to initialise the Leaflet TileLayer. See https://leafletjs.com/reference-1.6.0.html#tilelayer for reference.<br>
  Used in the [`Map` component](../../src/components/Map/index.js)

- `options`
  Object with Leaflet TileLayer configuration properties. See https://leafletjs.com/reference-1.6.0.html#tilelayer for reference.<br>
  Used in the [`Map` component](../../src/components/Map/index.js)

#### options

  Object with Leaflet configuration properties. See https://leafletjs.com/reference-1.6.0.html#map-factory for reference.<br>
  Used in the [`map-options` service](../../src/shared/services/configuration/map-options.js)

### fetchQuestionsFromBackend

Boolean value that, when true, will bypass getting the configuration for the incident submission form questions from local modules. Instead, a request to an API endpoint is made to retrieve the configuration. See [QUESTIONS_ENDPOINT](#QUESTIONS_ENDPOINT)

### showVulaanControls

Boolean value that, when false, will not show extra questions after the first page of questions in the incident submission form.

### STATIC_MAP_SERVER_URL

URL for the map server that serves static map tile images.<br>
Used in the [`MapStatic` component](../../src/components/MapStatic/index.js)

### AUTH_ME_ENDPOINT

URl for the authorization endpoint; retrieves user profile data.<br>
See https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_user_auth_me for reference.

### CATEGORIES_ENDPOINT

URL for the public categories endpoint. Used for retrieving subcategory and category data when posting to the [INCIDENT_PUBLIC_ENDPOINT](#INCIDENT_PUBLIC_ENDPOINT) and [INCIDENT_PRIVATE_ENDPOINT](#INCIDENT_PRIVATE_ENDPOINT).<br>
See https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_public_terms_categories for reference.

### CATEGORIES_PRIVATE_ENDPOINT

URl for the private categories endpoint. Used by the settings module to `GET` and `PATCH` categories.<br>
See https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_private_categories_ for reference.

### DEPARTMENTS_ENDPOINT

URL for the private departments endpoint. Used by the settings module to `GET` and `PATCH` departments.<br>
See https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_private_departments_ for reference.

### FEEDBACK_FORMS_ENDPOINT

URL for the public feedback endpoint. Used by the KTO (klanttevredenheidsonderzoek) module to verify the validity of a request.<br>
No Swagger documentation available.

### FEEDBACK_STANDARD_ANSWERS_ENDPOINT

URL for the public feedback answers endpoint. Used by the KTO (klanttevredenheidsonderzoek) module to retrieve questions regarding a person's incident handling satisfaction.<br>
No Swagger documentation available.

### FILTERS_ENDPOINT

URL for the private filters endpoint. Used to `GET`, `POST` and `PATCH` filters for a specific user.<br>
No Swagger documentation available.

### GEOGRAPHY_ENDPOINT

URL for the private incident geolocation endpoint. Used by the incident overview map.<br>
See https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_private_signals_geography for reference.

### IMAGE_ENDPOINT

URL for the public image endpoint. Used by the incident form to upload images for a specific incident.<br>
No Swagger documentation available.

### INCIDENTS_ENDPOINT

URL for the private incidents endpoint. Used to GET sets of incidents.<br>
See https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_private_signals_ for reference.

### INCIDENT_PRIVATE_ENDPOINT

URL for the private incident endpoint. Used to `POST` incident data for authorized users.<br>
See https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/post_signals_v1_private_signals_ for reference.

### INCIDENT_PUBLIC_ENDPOINT

URL for the public incident endpoint. Used to `POST` incident data for unauthorized users.<br>
See https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/post_signals_v1_public_signals for reference.

### OIDC_AUTH_ENDPOINT

URL for the oAuth2 service.

### OIDC_CLIENT_ID

oAuth2 `client_id` service parameter value.

### OIDC_RESPONSE_TYPE

oAuth2 `response_type` service parameter value.

### OIDC_SCOPE

oAuth2 `scope` service parameter value (specific to `signals-amsterdam` and `signals-weesp` implementations).

### OVL_KLOKKEN_LAYER

GeoJSON URL for the retrieval of public clock location data. Used by the incident form for showing clock locations on a map.<br>
No Swagger documentation available.

### OVL_VERLICHTING_LAYER

GeoJSON URL for the retrieval of street light data. Used by the incident form for showing street light locations on a map.<br>
No Swagger documentation available.

### PERMISSIONS_ENDPOINT

URL for the private permissions endpoint. Used by the settings module to `GET` the full set of permissions.<br>
No Swagger documentation available.

### PREDICTION_ENDPOINT

URL for the public machine learning prediction endpoint. Used by the incident form to get an indication of (sub)category based on user input.<br>
No Swagger documentation available.

### QUESTIONS_ENDPOINT

URL for the public question endpoint. Used to `GET` question configuration based on the value of the [fetchQuestionsFromBackend](#fetchQuestionsFromBackend) settings prop.

### ROLES_ENDPOINT

URL for the private roles endpoint. Used by the settings module to `GET`, `PATCH` and `POST` roles.<br>
No Swagger documentation available.

### SEARCH_ENDPOINT

URL for the private search endpoint. Used by the incident management module to retrieve incident by search query.<br>
No Swagger documentation available.

### TERMS_ENDPOINT

URL for the private terms endpoint. Used by the incident management module to `GET` and `POST` default response texts for incident handling.<br>
See https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_public_terms_categories for reference.

### USERS_ENDPOINT

URL for the private users endpoint. Used by the settings module to `GET`, `PATCH` and `POST` users.<br>
See https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_private_users_ for reference.
