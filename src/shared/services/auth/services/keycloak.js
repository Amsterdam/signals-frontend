import KeycloakJS from 'keycloak-js';

import configuration from '../../configuration/configuration';
import parseAccessToken from './parse-access-token/parse-access-token';

class Keycloak {
  constructor() {
    const { authEndpoint, realm, clientId } = configuration.keycloak || {};

    this.refreshIntervalId = null;
    this.keycloak = new KeycloakJS({
      url: authEndpoint,
      realm,
      clientId,
    });
    this.isInitialized = false;

    this.keycloak.onAuthSuccess = () => this.startRefreshInterval();

    this.keycloak.onAuthError = () => this.stopRefreshInterval();
    this.keycloak.onAuthRefreshError = () => this.stopRefreshInterval();
    this.keycloak.onAuthLogout = () => this.stopRefreshInterval();
    this.keycloak.onTokenExpired = () => {
      // This should never happen (auto refresh should keep token valid)
      this.stopRefreshInterval();
      this.logout();
    };
  }

  // eslint-disable-next-line require-await
  async init(options) {
    this.isInitialized = true;

    return this.keycloak.init({
      promiseType: 'native', // To enable async/await
      'check-sso': false, // To enable refresh token
      checkLoginIframe: false, // To enable refresh token
      pkceMethod: 'S256',
      ...options,
    });
  }

  async authenticate() {
    if (!this.isInitialized) {
      await this.init({
        onLoad: 'check-sso',
      });
    }

    if (this.isAuthenticated()) {
      const accessToken = this.getAccessToken();
      const { name, scopes } = parseAccessToken(accessToken);

      return {
        userName: name,
        userScopes: scopes,
        accessToken,
      };
    }

    return null;
  }

  isAuthenticated() {
    return this.keycloak.authenticated && !this.keycloak.isTokenExpired();
  }

  getAuthHeaders() {
    const token = this.getAccessToken();

    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  getAccessToken() {
    return this.keycloak.token;
  }

  async login() {
    if (!this.isInitialized) {
      await this.init();
    }

    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }

  startRefreshInterval() {
    // Refresh the token automatically once the user has been authenticated
    const minValidity = 30; // Token should be valid for at least the next 30 seconds
    const updateInterval = minValidity * 0.75; // Keep token valid by checking regularly

    // Start a token updater, if not yet running
    if (!this.refreshIntervalId) {
      this.refreshIntervalId = setInterval(() => {
        this.keycloak.updateToken(minValidity);
      }, updateInterval * 1000);
    }
  }

  stopRefreshInterval() {
    clearInterval(this.refreshIntervalId);
    this.refreshIntervalId = null;
  }
}

export default Keycloak;
