const endpoints = {
  AUTH_ME_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/private/me/`,
  CATEGORIES_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/public/terms/categories/`,
  CATEGORIES_PRIVATE_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/private/categories/`,
  DEPARTMENTS_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/private/departments/`,
  FEEDBACK_FORMS_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/public/feedback/forms/`,
  FEEDBACK_STANDARD_ANSWERS_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/public/feedback/standard_answers/`,
  FILTERS_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/private/me/filters/`,
  GEOGRAPHY_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/private/signals/geography`,
  IMAGE_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/signal/image/`,
  INCIDENTS_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/private/signals/`,
  INCIDENT_PRIVATE_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/private/signals/`,
  INCIDENT_PUBLIC_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/public/signals/`,
  PERMISSIONS_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/private/permissions/`,
  PREDICTION_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/category/prediction`,
  QUESTIONS_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/public/questions/`,
  ROLES_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/private/roles/`,
  SEARCH_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/private/search`,
  TERMS_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/private/terms/categories/`,
  USERS_ENDPOINT: `${window.CONFIG.apiBaseUrl}/signals/v1/private/users/`,
};

const applicationConfig = window.CONFIG ? { ...window.CONFIG, ...endpoints } : {};

const configProxy = new Proxy(applicationConfig, {
  get(target, name, receiver) {
    if (!Reflect.has(target, name)) {
      return undefined;
    }

    return Reflect.get(target, name, receiver);
  },

  deleteProperty() {
    throw new Error('Props cannot be deleted');
  },
});

Object.preventExtensions(configProxy);

export default configProxy;
