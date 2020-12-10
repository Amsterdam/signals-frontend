import authz from './services/authz';
import keycloak from './services/keycloak';
import configuration from '../configuration/configuration';

const storage = global.localStorage ? global.localStorage : global.sessionStorage;
const OAUTH_DOMAIN_KEY = 'oauthDomain'; // Domain that is used for login

/**
 * Returns OAuth domain .
 * 
 * @returns {string} domain
 */
export function getOauthDomain() {
  return storage.getItem(OAUTH_DOMAIN_KEY);
}

/**
 * Returns auth implementation.
 */
function getAuth() {
  if (configuration.keycloak && getOauthDomain() === 'keycloak') {
    return keycloak;
  }

  return authz;
}

/**
 * Returns the access token from local storage when available.
 *
 * @returns {string} The access token.
 */
export function getAccessToken() {
  return getAuth().getAccessToken();
}

/**
 * Perform user login.
 *
 * @param {string} domain
 */
export async function login(domain) {
  if (typeof global.Storage === 'undefined') {
    throw new TypeError('Storage not available; cannot proceed with logging in');
  }

  storage.setItem(OAUTH_DOMAIN_KEY, domain);
  domain === 'keycloak' ? keycloak.login() : authz.login(domain);
}

/**
 * Performs user logout.
 */
export function logout() {
  const auth = getAuth();

  storage.removeItem(OAUTH_DOMAIN_KEY);
  auth.logout();
}

/**
 * Returns boolean indicating if user is authenticated (with non-expired token).
 */
export const isAuthenticated = () => getAuth().isAuthenticated();

/**
 * Creates an object containing the authorization headers needed for an API call.
 *
 * @returns {Object<string, string>} The headers needed for an API call.
 */
export function getAuthHeaders() {
  return getAuth().getAuthHeaders();
}

/**
 * Perform user authentication on app init.
 */
export const authenticate = async () => getAuth().authenticate();
