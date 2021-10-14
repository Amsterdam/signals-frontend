// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { AUTH_ERROR } from './dummy-auth'
import DummyAuth from '.'

describe('DummyAuth', () => {
  it('should return a dummy auth class', async () => {
    const auth = new DummyAuth()
    expect(await auth.authenticate()).toBe(null)
    expect(auth.init()).toBe(undefined)
    expect(auth.getIsAuthenticated()).toBe(false)
    expect(auth.getAuthHeaders()).toEqual({})
    await expect(auth.login()).rejects.toEqual(new Error(AUTH_ERROR))
    expect(auth.logout()).toBe(undefined)
  })
})
