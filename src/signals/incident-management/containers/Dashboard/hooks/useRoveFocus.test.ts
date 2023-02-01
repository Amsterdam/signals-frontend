// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import { act } from 'react-test-renderer'

import { useRoveFocus } from './useRoveFocus'

describe('useRoveFocus', () => {
  it('should set a focus index', () => {
    const { result } = renderHook(() => useRoveFocus(10))

    act(() => {
      userEvent.keyboard('{ArrowDown}')
    })

    expect(result.current.currentFocus).toBe(1)

    act(() => {
      userEvent.keyboard('{ArrowUp}')
    })

    act(() => {
      userEvent.keyboard('{ArrowUp}')
    })

    expect(result.current.currentFocus).toBe(9)

    act(() => {
      userEvent.keyboard('{ArrowDown}')
    })

    expect(result.current.currentFocus).toBe(0)

    act(() => {
      userEvent.keyboard('a')
    })

    expect(result.current.currentFocus).toBe(0)
  })
})
