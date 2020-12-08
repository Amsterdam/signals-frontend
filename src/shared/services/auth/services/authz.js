import accessTokenParser from './access-token-parser/access-token-parser';
import randomStringGenerator from './random-string-generator/random-string-generator';
import queryStringParser from './query-string-parser/query-string-parser';

import configuration from '../../configuration/configuration';

let tokenData = {};
const storage = global.localStorage || global.sessionStorage;

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

// The keys of values we need to store in the local storage
const STATE_TOKEN_KEY = 'stateToken'; // OAuth2 state token (prevent CSRF)
const NONCE_KEY = 'nonce'; // OpenID Connect nonce (prevent replay attacks)
const ACCESS_TOKEN_KEY = 'accessToken'; // OAuth2 access token

class Authz {
  constuctor() {
    this.domains = ['datapunt', 'grip'];
  }

  init() {
    this._restoreAccessToken(); // Restore access token from local storage
    this._handleAuthorizationError(); // Catch any error from the OAuth2 authorization service
    this._handleAuthorizationCallback(); // Handle a callback from the OAuth2 authorization service
  }

  isAuthenticated() {
    const expiresAt = accessTokenParser(this.getAccessToken())?.expiresAt;

    if (!expiresAt) return false;

    const hasExpired = expiresAt * 1000 < Date.now();

    return !hasExpired;
  }

  authenticate() {
    this.init();

    if (this.isAuthenticated()) {
      const accessToken = this.getAccessToken();
      const { name, scopes } = accessTokenParser(accessToken);

      return {
        userName: name,
        userScopes: scopes,
        accessToken,
      };
    }

    return null;
  }

  /**
   * Creates an object containing the
   * authorization headers needed for an API call.
   *
   * @returns {Object<string, string>} The headers needed for an API call.
   */
  getAuthHeaders() {
    const accessToken = this.getAccessToken();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  }

  getAccessToken() {
    return storage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Handle login callback.
   */
  _handleAuthorizationCallback() {
    // Parse query string into object
    const params = queryStringParser(global.location.hash);

    if (!params || !params.state || params.code) return;

    // Handle other callbacks
    if (AUTH_PARAMS.some(param => params[param] === undefined)) return;
    this._saveToken(params.state, params.access_token);
  }

  /**
   * Gets the access token and return path, and clears the localstorage
   */
  _saveToken(state, accessToken) {
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

  _restoreAccessToken() {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      tokenData = accessTokenParser(accessToken);
    }
  }

  /**
   * Finishes an error from the OAuth2 authorization service.
   *
   * @param code {string} Error code as returned from the service.
   * @param description {string} Error description as returned from the
   * service.
   */
  _handleError(code, description) {
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
  _handleAuthorizationError() {
    const params = queryStringParser(global.location.search);
    if (params && params.error) {
      this._handleError(params.error, params.error_description);
    }
  }

  _getDomain(domain) {
    // TODO
    // Add business logic for the GRIP or datapunt indentity provider (for instance by mapping the domain from the url)
    // ex: parse https://waternet.data.amsterdam.nl, if(waternet) return grip
    // default value is datapunt
    return domain || this.domains[0];
  }

  /**
   * Login token flow.
   */
  _loginToken(domain, nonce, stateToken) {
    const searchParams = new URLSearchParams({
      client_id: configuration.oidc.clientId,
      response_type: configuration.oidc.responseType,
      scope: configuration.oidc.scope,
      state: stateToken,
      nonce,
      redirect_uri: AUTH_REDIRECT_URI,
      idp_id: this._getDomain(domain),
    });

    return `${configuration.oidc.authEndpoint}?${searchParams.toString()}`;
  }

  login(domain) {
    storage.removeItem(ACCESS_TOKEN_KEY);

    const stateToken = randomStringGenerator();
    const nonce = randomStringGenerator();

    if (!stateToken || !nonce) throw new Error('crypto library is not available on the current browser');
    storage.setItem(STATE_TOKEN_KEY, stateToken);
    storage.setItem(NONCE_KEY, nonce);

    global.location.assign(this._loginToken(domain, nonce, stateToken));
  }

  logout() {
    storage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export default new Authz();
