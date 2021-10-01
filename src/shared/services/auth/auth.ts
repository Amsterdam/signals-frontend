// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { UserCredentials } from 'containers/App/types'
import configuration from '../configuration/configuration'
import Keycloak from './services/keycloak'
import ImplicitAuth from './services/implicit-auth'

const useKeycloak =
  configuration.oidc.responseType === 'code' &&
  (configuration.oidc as any).realm

const auth = useKeycloak ? new Keycloak() : new ImplicitAuth()

/**
 * Returns access token.
 */
export const getAccessToken = (): string | null => auth.getAccessToken()

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
