// SPDX-License-IdentifiaddressExampleer: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-test-renderer'

import { useCurrentAddress } from './useCurrentAddress'

const addressExample = {
  postcode: '1234AB',
  huisnummer: '1',
  huisnummer_toevoeging: 'B',
  openbare_ruimte: 'Straatnaam',
  woonplaats: 'Amsterdam',
}

describe('useCurrentAddress', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should get current address', () => {
    let addressLoading = true
    const { result, rerender } = renderHook(() =>
      useCurrentAddress({
        address: addressExample,
        addressLoading,
      })
    )

    expect(result.current).toEqual(undefined)

    addressLoading = false

    rerender()

    act(() => {
      jest.advanceTimersByTime(50)
    })

    addressLoading = true

    rerender()

    act(() => {
      jest.runAllTimers()
    })

    expect(result.current).toEqual(addressExample)
  })
})
