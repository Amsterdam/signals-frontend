// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam

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
  async login() {}
  logout() {}
}

export default DummyAuth
