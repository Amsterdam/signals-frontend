import queryStringParser from './services/query-string-parser/query-string-parser';
import randomStringGenerator from './services/random-string-generator/random-string-generator';
import accessTokenParser from './services/access-token-parser/access-token-parser';
import configuration from '../configuration/configuration';
import Keycloak from 'keycloak-js';

const storage = global.localStorage ? global.localStorage : global.sessionStorage;
let keycloak;

// A map of the error keys, that the OAuth2 authorization service can return, to a full description
const ERROR_MESSAGES = {
  invalid_request:
    'The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.',
  unauthorized_client: 'The client is not authorized to request an access token using this method.',
  access_denied: 'The resource owner or authorization server denied the request.',
  unsupported_response_type: 'The authorization server does not support obtaining an access token using this method.',
  invalid_scope: 'The requested scope is invalid, unknown, or malformed.',
  server_error:
    'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.',
  temporarily_unavailable:
    'The authorization server is currently unable to handle the request due to a temporary overloading or maintenance of the server.',
};

// The parameters the OAuth2 authorization service will return on success
const AUTH_PARAMS = ['access_token', 'token_type', 'expires_in', 'state'];

const AUTH_REDIRECT_URI = `${global.location.protocol}//${global.location.host}/manage/incidents`;

const domainList = ['datapunt', 'grip'];

// const ACCESS_TOKEN_REFRESH_TIME = 60000; // If token expiry is less than 60000 ms in the future, it should be refreshed
// const ACCESS_TOKEN_REFRESH_INTERVAL = 20000; // Check expiry of access token every 20000 ms

function getDomain(domain) {
  // TODO
  // Add business logic for the GRIP or datapunt indentity provider (for instance by mapping the domain from the url)
  // ex: parse https://waternet.data.amsterdam.nl, if(waternet) return grip
  // default value is datapunt
  return domain || domainList[0];
}

// The keys of values we need to store in the local storage
const STATE_TOKEN_KEY = 'stateToken'; // OAuth2 state token (prevent CSRF)
const NONCE_KEY = 'nonce'; // OpenID Connect nonce (prevent replay attacks)
const ACCESS_TOKEN_KEY = 'accessToken'; // OAuth2 access token
const OAUTH_DOMAIN_KEY = 'oauthDomain'; // Domain that is used for login

let tokenData = {};

/**
 * Finishes an error from the OAuth2 authorization service.
 *
 * @param code {string} Error code as returned from the service.
 * @param description {string} Error description as returned from the
 * service.
 */
function handleError(code, description) {
  storage.removeItem(STATE_TOKEN_KEY);

  // Remove parameters from the URL, as set by the error callback from the
  // OAuth2 authorization service, to clean up the URL.
  global.location.assign(`${global.location.protocol}//${global.location.host}${global.location.pathname}`);

  throw new Error(`Authorization service responded with error ${code} [${description}] (${ERROR_MESSAGES[code]})`);
}

/**
 * Handles errors in case they were returned by the OAuth2 authorization
 * service.
 */
function handleAuthorizationError() {
  const params = queryStringParser(global.location.search);
  if (params && params.error) {
    handleError(params.error, params.error_description);
  }
}

/**
 * Gets the access token and return path, and clears the local storage.
 */
function saveToken(state, accessToken) {
  // The state param must be exactly the same as the state token we
  // have saved in local storage (to prevent CSRF)
  const localStateToken = storage.getItem(STATE_TOKEN_KEY);
  const paramStateToken = decodeURIComponent(state, accessToken);

  if (paramStateToken !== localStateToken) {
    throw new Error(
      `Authenticator encountered an invalid state token (${state}). Local state token: ${localStateToken}.`
    );
  }

  tokenData = accessTokenParser(accessToken);
  const localNonce = storage.getItem(NONCE_KEY);
  if (tokenData.nonce && tokenData.nonce !== localNonce) {
    throw new Error(
      `Authenticator encountered an invalid nonce (${tokenData.nonce}). Local nonce token: ${localNonce}.`
    );
  }

  storage.setItem(ACCESS_TOKEN_KEY, accessToken);

  storage.removeItem(STATE_TOKEN_KEY);
  storage.removeItem(NONCE_KEY);

  // Clean up URL; remove query and hash
  // https://stackoverflow.com/questions/4508574/remove-hash-from-url
  global.history.replaceState('', document.title, global.location.pathname);
}

/**
 * Handle login callback.
 */
function handleAuthorizationCallback() {
  // Parse query string into object
  const params = queryStringParser(global.location.hash);

  if (!params || !params.state || params.code) return;

  // Handle other callbacks
  if (AUTH_PARAMS.some(param => params[param] === undefined)) return;
  saveToken(params.state, params.access_token);
}

/**
 * Returns the access token from local storage when available.
 *
 * @returns {string} The access token.
 */
export function getAccessToken() {
  return storage.getItem(ACCESS_TOKEN_KEY) || keycloak?.idToken;
}

export function getOauthDomain() {
  return storage.getItem(OAUTH_DOMAIN_KEY);
}

/**
 * Restores the access token from local storage when available.
 */
function restoreAccessToken() {
  const accessToken = getAccessToken();
  if (accessToken) {
    tokenData = accessTokenParser(accessToken);
  }
}

/**
 * Login token flow.
 */
function loginToken(domain, nonce, stateToken) {
  const searchParams = new URLSearchParams({
    client_id: configuration.oidc.clientId,
    response_type: configuration.oidc.responseType,
    scope: configuration.oidc.scope,
    state: stateToken,
    nonce,
    redirect_uri: AUTH_REDIRECT_URI,
    idp_id: getDomain(domain),
  });

  return `${configuration.oidc.authEndpoint}?${searchParams.toString()}`;
}

/**
 * Redirects to the OAuth2 authorization service.
 */
export function login(domain) {
  if (typeof global.Storage === 'undefined') {
    throw new TypeError('Storage not available; cannot proceed with logging in');
  }

  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.setItem(OAUTH_DOMAIN_KEY, domain);

  // temporary until Grip is phased out, code should be rewritten and determine flow by oidc.responseType
  if (domain === 'keycloak') {
    keycloak.login();
  } else {
    // Get the URI the OAuth2 authorization service needs to use as callback
    // const callback = encodeURIComponent(`${location.protocol}//${location.host}${location.pathname}`);
    // Get a random string to prevent CSRF
    const stateToken = randomStringGenerator();
    const nonce = randomStringGenerator();

    if (!stateToken || !nonce) throw new Error('crypto library is not available on the current browser');
    storage.setItem(STATE_TOKEN_KEY, stateToken);
    storage.setItem(NONCE_KEY, nonce);

    global.location.assign(loginToken(domain, nonce, stateToken));
  }
}

export function logout() {
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(OAUTH_DOMAIN_KEY);

  keycloak?.logout();
}

/**
 * Initializes the auth service when needed. Catches any callback params and
 * errors from the OAuth2 authorization service when available.
 *
 * When no access token is available it initiates the login process which will
 * redirect the user to the OAuth2 authorization service.
 *
 */
export async function initAuth() {
  restoreAccessToken(); // Restore access token from local storage
  handleAuthorizationError(); // Catch any error from the OAuth2 authorization service
  handleAuthorizationCallback(); // Handle a callback from the OAuth2 authorization service

  if (configuration.keycloak) {
    const { authEndpoint, realm, clientId } = configuration.keycloak;
    keycloak = new Keycloak({
      url: authEndpoint,
      realm,
      clientId,
    });

    keycloak.onAuthSuccess = function() {
      // TODO set up refresh
      // autoRefreshToken(true);
    };

    await keycloak.init({
      promiseType: 'native', // To enable async/await
      'check-sso': false, // To enable refresh token
      checkLoginIframe: false, // To enable refresh token
      onLoad: 'check-sso',
      pkceMethod: 'S256',
    });
    // setRefreshAccessTokenInterval(); // Start periodic check for validity of access token, and refresh if expired
  }
}

export const isAuthenticated = () => {
  const expiresAt = accessTokenParser(getAccessToken())?.expiresAt || keycloak?.idTokenParsed?.exp;

  if (!expiresAt) return false;

  const hasExpired = expiresAt * 1000 < Date.now();

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
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export const authenticate = async () => {
  await initAuth();

  const accessToken = getAccessToken();

  if (accessToken) {
    return { userName: getName(), userScopes: getScopes(), accessToken };
  }

  return null;
};
