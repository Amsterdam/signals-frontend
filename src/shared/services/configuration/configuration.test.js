// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
global.window.CONFIG = {
  foo: 'bar',
  baz: 'qux',
}

const configuration = require('./configuration').default

describe('shared/services/configuration/configuration', () => {
  it('should return a config prop', () => {
    expect(configuration).toHaveProperty('foo')
    expect(configuration.baz).toEqual('qux')

    // destructuring should also work
    const { foo } = configuration
    expect(foo).toEqual('bar')
  })

  it('should not be able to set', () => {
    expect(() => {
      configuration.bar = 'foo'
    }).toThrow()
  })

  it('should not be able to delete', () => {
    expect(() => {
      delete configuration.foo
    }).toThrow()
  })

  it('should return undefined for missing props', () => {
    const { missing } = configuration

    expect(missing).toBeUndefined()
  })
})
