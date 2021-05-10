// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { renderHook, act } from '@testing-library/react-hooks'

import useDelayedDoubleClick, { CLICK_TIMEOUT } from '../useDelayedDoubleClick'

describe('hooks/useDelayedDoubleClick', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runAllTimers()
    jest.useRealTimers()
  })

  it('should execute clickFunc', () => {
    const clickFunc = jest.fn()

    const { result } = renderHook(() => useDelayedDoubleClick(clickFunc))

    const event = { preventDefault: jest.fn() }

    act(() => {
      result.current.click(event)
    })

    expect(clickFunc).not.toHaveBeenCalled()

    jest.advanceTimersByTime(CLICK_TIMEOUT - 2)

    expect(clickFunc).not.toHaveBeenCalled()

    act(() => {
      result.current.click(event)
    })

    jest.advanceTimersByTime(1)

    expect(clickFunc).not.toHaveBeenCalled()

    jest.runOnlyPendingTimers()

    expect(clickFunc).toHaveBeenCalledTimes(1)
    expect(clickFunc).toHaveBeenCalledWith(event)
  })

  it('should not execute clickFunc when double clicking', () => {
    const clickFunc = jest.fn()

    const { result } = renderHook(() => useDelayedDoubleClick(clickFunc))

    const event = { preventDefault: jest.fn() }

    act(() => {
      result.current.click(event)
    })

    expect(clickFunc).not.toHaveBeenCalled()

    act(() => {
      result.current.doubleClick()
    })

    jest.advanceTimersByTime(CLICK_TIMEOUT)

    expect(clickFunc).not.toHaveBeenCalled()

    act(() => {
      result.current.click(event)
    })

    expect(clickFunc).not.toHaveBeenCalled()

    jest.advanceTimersByTime(CLICK_TIMEOUT)

    act(() => {
      result.current.click(event)
    })

    jest.runOnlyPendingTimers()

    expect(clickFunc).toHaveBeenCalledWith(event)
  })
})
