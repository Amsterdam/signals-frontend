// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
export const AUTH_ERROR =
  'Inloggen is niet gelukt. Controleer of je browser cookies toestaat, of probeer het met een andere browser.'

/**
 * Dummy auth class
 * Used as fallback when the user's browser does not support authentication (e.g. when local storage is disabled)
 */
class DummyAuth {
  async authenticate() {
    return Promise.resolve(null)
  }
  init() {}
  getIsAuthenticated(): boolean {
    return false
  }
  getAuthHeaders() {
    return {}
  }
  async login() {
    return Promise.reject(new Error(AUTH_ERROR))
  }
  logout() {}
}

export default DummyAuth
