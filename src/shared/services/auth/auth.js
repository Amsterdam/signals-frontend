import queryStringParser from './services/query-string-parser/query-string-parser';
import stateTokenGenerator from './services/state-token-generator/state-token-generator';
import accessTokenParser from './services/access-token-parser/access-token-parser';
import CONFIGURATION from '../configuration/configuration';

// A map of the error keys, that the OAuth2 authorization service can return, to a full description
const ERROR_MESSAGES = {
  invalid_request: 'The request is missing a required parameter, includes an invalid parameter value, '
    + 'includes a parameter more than once, or is otherwise malformed.',
  unauthorized_client: 'The client is not authorized to request an access token using this method.',
  access_denied: 'The resource owner or authorization server denied the request.',
  unsupported_response_type: 'The authorization server does not support obtaining an access token using '
    + 'this method.',
  invalid_scope: 'The requested scope is invalid, unknown, or malformed.',
  server_error: 'The authorization server encountered an unexpected condition that prevented it from '
    + 'fulfilling the request.',
  temporarily_unavailable: 'The authorization server is currently unable to handle the request due to a '
    + 'temporary overloading or maintenance of the server.',
};

// The parameters the OAuth2 authorization service will return on success
const AUTH_PARAMS = ['access_token', 'token_type', 'expires_in', 'state'];

// The requested OpenID scopes
const scopes = [
  'openid',
  'email',
  'profile',
];

const domainList = [
  'datapunt',
  'grip',
];

function getDomain(domain) {
  // TODO
  // Add business logic for the GRIP or datapunt indentity provider (for instance by mapping the domain from the url)
  // ex: parse https://waternet.data.amsterdam.nl, if(waternet) return grip
  // default value is datapunt
  return domain || domainList[0];
}

const encodedScopes = encodeURIComponent(scopes.join(' '));
// The URI we need to redirect to for communication with the OAuth2
// authorization service
export const AUTH_PATH = domain => `oauth2/authorize?idp_id=${getDomain(domain)}&response_type=token&client_id=sia&scope=${encodedScopes}`;

// The keys of values we need to store in the session storage
//
// `location.pathname` string at the moment we redirect to the
// OAuth2 authorization service, and need to get back to afterwards
const RETURN_PATH = 'returnPath';
// The OAuth2 state(token) (OAuth terminology, has nothing to do with
// our app state), which is a random string
const STATE_TOKEN = 'stateToken';
// The access token returned by the OAuth2 authorization service
// containing user userScopes and name
const ACCESS_TOKEN = 'accessToken';

const OAUTH_DOMAIN = 'oauthDomain';

let returnPath;
let tokenData = {};

/**
 * Finishes an error from the OAuth2 authorization service.
 *
 * @param code {string} Error code as returned from the service.
 * @param description {string} Error description as returned from the
 * service.
 */
function handleError(code, description) {
  localStorage.removeItem(STATE_TOKEN);

  // Remove parameters from the URL, as set by the error callback from the
  // OAuth2 authorization service, to clean up the URL.
  global.location.assign(`${global.location.protocol}//${global.location.host}${global.location.pathname}`);

  throw new Error('Authorization service responded with error '
    + `${code} [${description}] (${ERROR_MESSAGES[code]})`);
}

/**
 * Handles errors in case they were returned by the OAuth2 authorization
 * service.
 */
function catchError() {
  const params = queryStringParser(global.location.search);
  if (params && params.error) {
    handleError(params.error, params.error_description);
  }
}

/**
 * Gets the access token and return path, and clears the session storage.
 */
function handleCallback() {
  // Parse query string into object
  const params = queryStringParser(global.location.hash);
  if (!params) {
    return;
  }

  // Make sure all required parameters are there
  if (AUTH_PARAMS.some(param => params[param] === undefined)) {
    return;
  }

  // The state param must be exactly the same as the state token we
  // have saved in the session (to prevent CSRF)
  const localStateToken = localStorage.getItem(STATE_TOKEN);
  if (decodeURIComponent(params.state) !== localStateToken) {
    throw new Error(`Authenticator encountered an invalid state token (${params.state})`);
  }

  const accessToken = params.access_token;

  tokenData = accessTokenParser(accessToken);
  localStorage.setItem(ACCESS_TOKEN, accessToken);

  returnPath = localStorage.getItem(RETURN_PATH);
  localStorage.removeItem(RETURN_PATH);
  localStorage.removeItem(STATE_TOKEN);

  // Clean up URL; remove query and hash
  // https://stackoverflow.com/questions/4508574/remove-hash-from-url
  global.history.replaceState('', document.title, global.location.pathname);
}

/**
 * Returns the access token from session storage when available.
 *
 * @returns {string} The access token.
 */
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN);
}

export function getOauthDomain() {
  return localStorage.getItem(OAUTH_DOMAIN);
}

/**
 * Restores the access token from session storage when available.
 */
function restoreAccessToken() {
  const accessToken = getAccessToken();
  if (accessToken) {
    tokenData = accessTokenParser(accessToken);
  }
}

/**
 * Redirects to the OAuth2 authorization service.
 */
export function login(domain) {
  // Get the URI the OAuth2 authorization service needs to use as callback
  // const callback = encodeURIComponent(`${location.protocol}//${location.host}${location.pathname}`);
  // Get a random string to prevent CSRF
  const stateToken = stateTokenGenerator();
  const encodedStateToken = encodeURIComponent(stateToken);

  if (!stateToken) {
    throw new Error('crypto library is not available on the current browser');
  }

  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.setItem(RETURN_PATH, global.location.hash);
  localStorage.setItem(STATE_TOKEN, stateToken);
  localStorage.setItem(OAUTH_DOMAIN, domain);

  const redirectUri = encodeURIComponent(`${global.location.protocol}//${global.location.host}/manage/incidents`);
  global.location.assign(`${CONFIGURATION.AUTH_ROOT}${AUTH_PATH(domain)}&state=${encodedStateToken}&redirect_uri=${redirectUri}`);
}

export function logout() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(OAUTH_DOMAIN);
}

/**
 * Initializes the auth service when needed. Catches any callback params and
 * errors from the OAuth2 authorization service when available.
 *
 * When no access token is available it initiates the login process which will
 * redirect the user to the OAuth2 authorization service.
 *
 */
export function initAuth() {
  returnPath = '';
  restoreAccessToken(); // Restore acces token from session storage
  catchError(); // Catch any error from the OAuth2 authorization service
  handleCallback(); // Handle a callback from the OAuth2 authorization service
}

/**
 * Gets the return path that was saved before the login process was initiated.
 *
 * @returns {string} The return path where we moved away from when the login
 * process was initiated.
 */
export function getReturnPath() {
  return returnPath;
}

export const isAuthenticated = () => {
  const decoded = accessTokenParser(getAccessToken());

  if (!decoded?.expiresAt) return false;

  const hasExpired = decoded.expiresAt * 1000 < Date.now();

  return !hasExpired;
};

export function getScopes() {
  return tokenData.scopes || [];
}

export function getName() {
  return tokenData.name || '';
}

/**
 * Creates an instance of the native JS `Headers` class containing the
 * authorization headers needed for an API call.
 *
 * @returns {Object<string, string>} The headers needed for an API call.
 */
export function getAuthHeaders() {
  const accessToken = getAccessToken();
  return accessToken ? { Authorization: `Bearer ${getAccessToken()}` } : {};
}


export function authenticate() {
  initAuth();

  const accessToken = getAccessToken();
  if (accessToken) {
    const credentials = { userName: getName(), userScopes: getScopes(), accessToken: getAccessToken() };
    return credentials;
  }

  return null;
}
