// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, act } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import 'jest-styled-components'

import useEventEmitter from 'hooks/useEventEmitter'

import Highlight, { HIGHLIGHT_TIMEOUT_INTERVAL } from '.'

describe('signals/incident-management/containers/IncidentDetail/components/HighLight', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  describe('rendering', () => {
    it('should render all children that are passed in', () => {
      const { queryAllByTestId } = render(
        <Highlight type="foo">
          <div data-testid="highlight-child">some text</div>
        </Highlight>
      )

      expect(queryAllByTestId('highlight-child')).toHaveLength(1)
    })
  })

  it('should not animate when types do not match', () => {
    jest.spyOn(global.window, 'setTimeout')
    const { result } = renderHook(() => useEventEmitter())
    render(
      <Highlight type="qux">
        <div>some text</div>
      </Highlight>
    )

    expect(global.window.setTimeout).not.toHaveBeenCalledWith(
      expect.any(Function),
      HIGHLIGHT_TIMEOUT_INTERVAL
    )

    act(() => {
      result.current.emit('highlight', { type: 'zork' })
    })

    expect(global.window.setTimeout).not.toHaveBeenCalledWith(
      expect.any(Function),
      HIGHLIGHT_TIMEOUT_INTERVAL
    )

    act(() => {
      result.current.emit('highlight', { type: 'qux' })
    })

    expect(global.window.setTimeout).toHaveBeenCalledWith(
      expect.any(Function),
      HIGHLIGHT_TIMEOUT_INTERVAL
    )

    global.window.setTimeout.mockRestore()
  })

  it('should animate', () => {
    const { result } = renderHook(() => useEventEmitter())
    const { unmount } = render(
      <Highlight type="bar">
        <div>some text</div>
      </Highlight>
    )

    // testing against class name, instead of ::after pseudo element; jest styled components cannot target pseudo elements
    expect(document.querySelector('.animate')).not.toBeInTheDocument()

    act(() => {
      result.current.emit('highlight', { type: 'bar' })
    })

    expect(document.querySelector('.animate')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(HIGHLIGHT_TIMEOUT_INTERVAL)
    })

    expect(document.querySelector('.animate')).toBeInTheDocument()

    unmount()
  })
})
