// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { UserCredentials } from 'containers/App/types'

import DummyAuth from './services/dummy-auth'
import ImplicitAuth from './services/implicit-auth'
import Keycloak from './services/keycloak-auth'
import configuration from '../configuration/configuration'

// Verify that local or session storage is supported & enabled
let storageEnabled = false
try {
  storageEnabled = Boolean(window.localStorage || window.sessionStorage)
} catch (error) {
  // Accessing local- or sessionstorage throws when
  //  this type of storage is explicitly disabled by the user
}

// Keycloak login depends on cookies for SSO, and realm for login
const shouldUseKeycloak =
  configuration.oidc.responseType === 'code' &&
  (configuration.oidc as any).realm &&
  navigator.cookieEnabled

let auth: Keycloak | ImplicitAuth | DummyAuth

if (storageEnabled && shouldUseKeycloak) {
  auth = new Keycloak()
}
if (storageEnabled && !shouldUseKeycloak) {
  auth = new ImplicitAuth()
}
if (!storageEnabled) {
  auth = new DummyAuth()
}

/**
 * Perform user login.
 */
export const login = () => auth.login()

/**
 * Performs user logout.
 */
export const logout = () => auth.logout()

/**
 * Returns boolean indicating if user is authenticated (with non-expired token).
 */
export const getIsAuthenticated = (): boolean => auth.getIsAuthenticated()

/**
 * Creates an object containing the authorization headers needed for an API call.
 */
export const getAuthHeaders = (): { Authorization?: string } =>
  auth.getAuthHeaders()

/**
 * Perform user authentication on app initialization.
 */
export const authenticate = async (): Promise<UserCredentials | null> =>
  auth.authenticate()
