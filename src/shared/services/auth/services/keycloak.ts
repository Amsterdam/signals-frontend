// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import keycloakJS, { KeycloakInitOptions, KeycloakInstance } from 'keycloak-js'
import configuration from 'shared/services/configuration/configuration'

const AUTH_REDIRECT_URI = `${global.location.protocol}//${global.location.host}/manage/incidents`
const SILENT_CHECK_SSO_REDIRECT_URI = `${window.location.origin}/assets/html/silent-check-sso.html`
const OAUTH_DOMAIN_KEY = 'oauthDomain' // Domain that is used for login

const storage = global.localStorage || global.sessionStorage

class Keycloak {
  private keycloak: KeycloakInstance
  private refreshIntervalId: number | null = null

  constructor() {
    this.keycloak = keycloakJS({
      clientId: configuration.oidc.clientId,
      realm: (configuration.oidc as any).realm as string,
      url: configuration.oidc.authEndpoint,
    })

    this.keycloak.onAuthSuccess = () => this.startRefreshInterval()
    this.keycloak.onAuthRefreshError = () => this.stopRefreshInterval()
    this.keycloak.onAuthError = () => this.stopRefreshInterval()
    this.keycloak.onAuthLogout = () => this.stopRefreshInterval()
    this.keycloak.onTokenExpired = () => {
      // This should never happen (refresh interval should keep token valid)
      this.stopRefreshInterval()
      this.logout()
    }
  }

  async init() {
    const options: KeycloakInitOptions = {
      flow: 'standard', // Standard = code flow
      checkLoginIframe: false, // To keep user logged in, use refresh token instead of (silent) redirect
      pkceMethod: 'S256',
      useNonce: true,
      silentCheckSsoRedirectUri: SILENT_CHECK_SSO_REDIRECT_URI,
      silentCheckSsoFallback: true,
      redirectUri: AUTH_REDIRECT_URI,
    }

    /**
     *  If the oauth domain key is set to 'keycloak', this device logged in previously and SSO should be checked.
     *  For browsers that do not support silent checking (Safari) a redirect will be preformed instead.
     */
    if (storage.getItem(OAUTH_DOMAIN_KEY) === 'keycloak') {
      options.onLoad = 'check-sso'
    }

    return this.keycloak.init(options)
  }

  async authenticate() {
    await this.init()

    if (this.getIsAuthenticated()) {
      const accessToken = this.getAccessToken()

      return accessToken ? { accessToken } : null
    }

    return null
  }

  getIsAuthenticated(): boolean {
    return Boolean(
      this.keycloak.authenticated && !this.keycloak.isTokenExpired()
    )
  }

  getAuthHeaders(): {
    Authorization?: string
  } {
    const token = this.getAccessToken()

    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  getAccessToken(): string | null {
    return this.keycloak.token || null
  }

  login() {
    if (typeof global.Storage === 'undefined') {
      throw new TypeError(
        'Storage not available; cannot proceed with logging in'
      )
    }

    storage.setItem(OAUTH_DOMAIN_KEY, 'keycloak')

    this.keycloak.login({
      scope: configuration.oidc.scope,
    })
  }

  logout() {
    storage.removeItem(OAUTH_DOMAIN_KEY)

    this.keycloak.logout()
  }

  startRefreshInterval() {
    // Refresh the access token periodically
    const minValidity = 30 // Token should be valid for at least the next 30 seconds
    const updateInterval = minValidity * 0.75 // Keep token valid by checking regularly

    // Start a token updater, if not yet running
    if (!this.refreshIntervalId) {
      this.refreshIntervalId = setInterval(() => {
        this.keycloak.updateToken(minValidity)
      }, updateInterval * 1000) as unknown as number
    }
  }

  stopRefreshInterval() {
    if (this.refreshIntervalId !== null) {
      clearInterval(this.refreshIntervalId)
      this.refreshIntervalId = null
    }
  }
}

export default Keycloak
