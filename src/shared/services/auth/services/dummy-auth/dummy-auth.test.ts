import DummyAuth from '.'

describe('DummyAuth', () => {
  it('should return a dummy auth class', async () => {
    const auth = new DummyAuth()
    expect(await auth.authenticate()).toBe(null)
    expect(auth.init()).toBe(undefined)
    expect(auth.getIsAuthenticated()).toBe(false)
    expect(auth.getAuthHeaders()).toEqual({})
    expect(await auth.login()).toBe(undefined)
    expect(auth.logout()).toBe(undefined)
  })
})
