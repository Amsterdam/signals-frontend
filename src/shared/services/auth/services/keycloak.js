import KeycloakJS from 'keycloak-js';

import configuration from '../../configuration/configuration';
import accessTokenParser from './access-token-parser/access-token-parser';

let isInitialized = false;

class Keycloak {
  constructor() {
    const { authEndpoint, realm, clientId } = configuration.keycloak;
    this.keycloak = new KeycloakJS({
      url: authEndpoint,
      realm,
      clientId,
    });

    // TODO Add listeners for login to set refresh token interval e.g. onAuthSuccess
  }

  init() {
    if (!this.isInitialized) {
      this.isInitialized = true;

      return this.keycloak.init({
        promiseType: 'native', // To enable async/await
        'check-sso': false, // To enable refresh token
        onLoad: 'check-sso',
        checkLoginIframe: false, // To enable refresh token
        pkceMethod: 'S256',
      });
    }

    return;
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
}

export default new Keycloak();
