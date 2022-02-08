// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useCallback, useRef } from 'react'
import useDebounce from './useDebounce'

/**
 * Timeout by which clicks on the map are delayed so that potential double click can be captured
 * Increasing the value lead to a perceivable delay between click and the placement of the marker. Decreasing the value
 * could lead to a double click never being captured, because of the limited time to have both click registered.
 */
export const CLICK_TIMEOUT = 300

const useDelayedDoubleClick = (clickFunc) => {
  const doubleClicking = useRef(false)

  /**
   * Capture doubleClick event
   *
   * Will prevent click events from being fired until the timeout has expired
   */
  const debouncedDoubleClick = useCallback(() => {
    doubleClicking.current = true

    const dblClickTimeout = setTimeout(() => {
      doubleClicking.current = false
      clearTimeout(dblClickTimeout)
    }, CLICK_TIMEOUT * 2)
  }, [])

  const debouncedClick = useCallback(
    (event) => {
      if (doubleClicking.current) return

      clickFunc(event)
    },
    [clickFunc]
  )

  const click = useDebounce(debouncedClick, CLICK_TIMEOUT)

  return {
    doubleClick: debouncedDoubleClick,
    click,
  }
}

export default useDelayedDoubleClick
