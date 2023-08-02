// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import onButtonPress from './on-button-press'

describe('onButtonPress', () => {
  it('should invoke callback when key is space ', () => {
    const callback = jest.fn()
    onButtonPress({ key: ' ' }, callback)
    expect(callback).toHaveBeenCalled()
  })

  it('should invoke callback when key is Enter', () => {
    const callback = jest.fn()
    onButtonPress({ key: 'Enter' }, callback)
    expect(callback).toHaveBeenCalled()
  })

  it('should not invoke callback when key is not space or Enter', () => {
    const callback = jest.fn()
    onButtonPress({ key: 'a' }, callback)
    expect(callback).not.toHaveBeenCalled()
  })
})
