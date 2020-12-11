import KeycloakJS from 'keycloak-js';

import configuration from '../../configuration/configuration';
import accessTokenParser from './access-token-parser/access-token-parser';

class Keycloak {
  constructor() {
    const { authEndpoint, realm, clientId } = configuration.keycloak;
    this.keepAlive = null;
    this.keycloak = new KeycloakJS({
      url: authEndpoint,
      realm,
      clientId,
    });

    this.keycloak.onAuthSuccess = () => this._startRefreshInterval();

    this.keycloak.onAuthError = () => this._stopRefreshInterval();
    this.keycloak.onAuthRefreshError = () => this._stopRefreshInterval();
    this.keycloak.onAuthLogout = () => this._stopRefreshInterval();
    this.keycloak.onTokenExpired = () => {
      // This should never happen (auto refresh should keep token valid)
      this._stopRefreshInterval();
      this.logout();
    };
  }

  // eslint-disable-next-line require-await
  async init() {
    return this.keycloak.init({
      promiseType: 'native', // To enable async/await
      onLoad: 'login-required',
      checkLoginIframe: false, // To enable refresh token
      pkceMethod: 'S256',
    });
  }

  async authenticate() {
    await this.init();

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
    await this.init();

    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }

  _startRefreshInterval() {
    // Refresh the token automatically once the user has been authenticated
    const minValidity = 30; // Token should be valid for at least the next 30 seconds
    const updateInterval = minValidity * 0.75; // Keep token valid by checking regularly

    // Start a token updater, if not yet running
    if (!this.keepAlive) {
      this.keepAlive = setInterval(() => {
        this.keycloak.updateToken(minValidity);
      }, updateInterval * 1000);
    }
  }

  _stopRefreshInterval() {
    clearInterval(this.keepAlive);
    this.keepAlive = null;
  }
}

export default new Keycloak();
