// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
export default {
  // Retrieves geographical areas. See
  // https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_private_areas_geography_
  // for reference.
  AREAS_ENDPOINT: '/signals/v1/private/areas/',
  // Retrieves user profile data. See
  // https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_user_auth_me
  // for reference.
  AUTH_ME_ENDPOINT: '/signals/v1/private/me/',
  // Public. Retrieves subcategory and category data when posting to the
  // INCIDENT_PUBLIC_ENDPOINT and INCIDENT_PRIVATE_ENDPOINT. See
  // https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_public_terms_categories
  // for reference.
  CATEGORIES_ENDPOINT: '/signals/v1/public/terms/categories/',
  // Private. Used by the settings module to `GET` and `PATCH` categories. See
  // https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_private_categories_
  // for reference.
  CATEGORIES_PRIVATE_ENDPOINT: '/signals/v1/private/categories/',
  // Private. Used by the settings module to `GET` and `PATCH` departments. See
  // https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_private_departments_
  // for reference.
  DEPARTMENTS_ENDPOINT: '/signals/v1/private/departments/',
  // Public. Used by the KTO (klanttevredenheidsonderzoek) module to verify the
  // validity of a request. No Swagger documentation available.
  FEEDBACK_FORMS_ENDPOINT: '/signals/v1/public/feedback/forms/',
  // Public. Used by the KTO (klanttevredenheidsonderzoek) module to retrieve
  // questions regarding a person's incident handling satisfaction. No Swagger
  // documentation available.
  FEEDBACK_STANDARD_ANSWERS_ENDPOINT:
    '/signals/v1/public/feedback/standard_answers/',
  // Private. Used to `GET`, `POST` and `PATCH` filters for a specific user. No
  // Swagger documentation available.
  FILTERS_ENDPOINT: '/signals/v1/private/me/filters/',
  // Private. Incident geolocation used by the incident overview map. See
  // https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_private_signals_geography
  // for reference.
  GEOGRAPHY_ENDPOINT: '/signals/v1/private/signals/geography',
  GEOGRAPHY_PUBLIC_ENDPOINT: '/signals/v1/public/signals/geography',
  // Private. Used to GET sets of incidents. See
  // https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_private_signals_
  // for reference.
  INCIDENTS_ENDPOINT: '/signals/v1/private/signals/',
  // Private. Used to `POST` incident data for authorized users. See
  // https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/post_signals_v1_private_signals_
  // for reference.
  INCIDENT_PRIVATE_ENDPOINT: '/signals/v1/private/signals/',
  // Public. Used to `POST` incident data for unauthorized users. See
  // https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/post_signals_v1_public_signals
  // for reference.
  INCIDENT_PUBLIC_ENDPOINT: '/signals/v1/public/signals/',
  // Public. Used to retrieve a list of current signals.
  // Only available when the feature flag `ENABLE_PUBLIC_GEO_SIGNAL_ENDPOINT`
  // is turned on in the backend.
  MAP_SIGNALS_ENDPOINT: '/signals/v1/public/map-signals/',
  // Public. Used to request a login link in an email by 'POST' request with the reporter's email address.
  // No Swagger documentation available.
  MY_SIGNALS_ENDPOINT: '/signals/v1/my/signals',
  // Private. Used by the settings module to `GET` the full set of permissions.
  // No Swagger documentation available.
  MY_SIGNALS_LOGIN_URL: '/signals/v1/my/signals/request-auth-token',
  // Public. Used to request a list of incidents based on an email address. Return the incidents of the last 12 months.
  // No Swagger documentation available.
  MY_SIGNALS_USER: '/signals/v1/my/signals/me',
  // Private. Used to get information about the logged in reporter based on the passed token.
  // No Swagger documentation available.
  PERMISSIONS_ENDPOINT: '/signals/v1/private/permissions/',
  // Public. Machine learning prediction used by the incident form to get an
  // indication of (sub)category based on user input. No Swagger documentation
  // available.
  PREDICTION_ENDPOINT: '/signals/category/prediction',
  // Public. Used to `GET` questionnaire
  QA_QUESTIONNAIRES_ENDPOINT: '/signals/v1/public/qa/questionnaires/',
  // Public. Used to `GET` questionnaire session
  QA_SESSIONS_ENDPOINT: '/signals/v1/public/qa/sessions/',
  // Public. Used to `GET` questionnaire question
  QA_QUESTIONS_ENDPOINT: '/signals/v1/public/qa/questions/',
  // Public. Used to `GET` question configuration based on the value of
  // featureFlags.fetchQuestionsFromBackend in the app configuration app.json.
  QUESTIONS_ENDPOINT: '/signals/v1/public/questions/',
  // Private. Used by the settings module to `GET`, `PATCH` and `POST` roles.
  // No Swagger documentation available.
  ROLES_ENDPOINT: '/signals/v1/private/roles/',
  // Private. Used by the incident management module to retrieve incident by
  // search query. No Swagger documentation available.
  SEARCH_ENDPOINT: '/signals/v1/private/search',
  // Private. Used by the incident management module to retrieve possible
  // sources from which an incident originated. No Swagger documentation
  // available.
  SOURCES_ENDPOINT: '/signals/v1/private/sources/',
  // Private. Used by the incident management module to POST status messages for a category.
  STANDARD_TEXTS_CATEGORY_ENDPOINT:
    '/signals/v1/private/status-messages/category/',
  // Private. Used by the incident management module to retrieve and query standard texts.
  STANDARD_TEXTS_ENDPOINT: '/signals/v1/private/status-messages/',
  // Private. Used by the incident management module to retrieve and search standard texts, to patch updated data, post
  // a new standard text or to delete a standard text.
  STANDARD_TEXTS_SEARCH_ENDPOINT: '/signals/v1/private/status-messages/search',
  // Private. No swagger documentation available.
  TERMS_ENDPOINT: '/signals/v1/private/terms/categories/',
  // Private. Used by the settings module to `GET`, `PATCH` and `POST` users.
  // See
  // https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_private_users_
  // for reference.
  USERS_ENDPOINT: '/signals/v1/private/users/',
  // Private. Used to `GET` autocomplete results for username input.
  AUTOCOMPLETE_USERNAME_ENDPOINT: '/signals/v1/private/autocomplete/usernames/',
  // Private. Used to `GET` incidents for a given time span.
  REPORTS_ENDPOINT: '/signals/v1/private/reports/signals/',
  // Private. Used to `GET` a csv export of all signals and some other data.
  EXPORT_ENDPOINT: '/signals/v1/private/csv',
}
