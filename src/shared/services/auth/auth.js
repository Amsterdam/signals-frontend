// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import configuration from '../configuration/configuration'
import Authz from './services/authz'
import Keycloak from './services/keycloak'

const storage = global.localStorage
  ? global.localStorage
  : global.sessionStorage
const OAUTH_DOMAIN_KEY = 'oauthDomain' // Domain that is used for login

const keycloak = new Keycloak()
const authz = new Authz()

/**
 * Returns OAuth domain.
 *
 * @returns {string} domain
 */
export const getOauthDomain = () => storage.getItem(OAUTH_DOMAIN_KEY)

/**
 * Returns auth implementation.
 */
export const getAuth = () =>
  configuration.keycloak && getOauthDomain() === 'keycloak' ? keycloak : authz

/**
 * Returns the access token when available.
 *
 * @returns {string} The access token.
 */
export const getAccessToken = () => getAuth().getAccessToken()

/**
 * Perform user login.
 *
 * @param {string} domain
 */
export const login = async (domain) => {
  if (typeof global.Storage === 'undefined') {
    throw new TypeError('Storage not available; cannot proceed with logging in')
  }

  storage.setItem(OAUTH_DOMAIN_KEY, domain)
  if (domain === 'keycloak') {
    await keycloak.login()
  } else {
    authz.login(domain)
  }
}

/**
 * Performs user logout.
 */
export const logout = () => {
  const auth = getAuth()

  storage.removeItem(OAUTH_DOMAIN_KEY)
  auth.logout()
}

/**
 * Returns boolean indicating if user is authenticated (with non-expired token).
 */
export const isAuthenticated = () => getAuth().isAuthenticated()

/**
 * Creates an object containing the authorization headers needed for an API call.
 *
 * @returns {Object<string, string>} The headers needed for an API call.
 */
export const getAuthHeaders = () => getAuth().getAuthHeaders()

/**
 * Perform user authentication on app init.
 */
// eslint-disable-next-line require-await
export const authenticate = async () => getAuth().authenticate()
