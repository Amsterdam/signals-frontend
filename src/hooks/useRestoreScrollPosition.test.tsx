// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { fireEvent, waitFor, render } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import useRestoreScrollPosition from './useRestoreScrollPosition'
import { withAppContext } from '../test/utils'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    hash: '',
    key: '',
    pathname: '/',
    search: '',
    state: null,
  }),
}))

const page1 = 'example1'

const page2 = 'example2'

const scrollToMock = jest.fn()
global.scrollTo = scrollToMock

// Another route is using renderHook. However, useLocation doesn't work without a Routes context.
const ScrollComponent = ({ page }: { page: string }) => {
  useRestoreScrollPosition(page)
  return <></>
}

describe('useRestoreScrollPosition', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should save and restore scroll position when pathname matches and call scrollTo when a pathname is cached', async () => {
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      hash: '',
      key: '',
      pathname: page1,
      search: '',
      state: null,
    }))

    const { rerender } = render(
      withAppContext(<ScrollComponent page={page1} />)
    )

    // This just injects scrollY and makes sure the position is stored in scrollPositions
    fireEvent.scroll(window, { target: { scrollY: 200 } })

    jest.runAllTimers()

    await waitFor(() => {
      expect(scrollToMock).toHaveBeenCalledTimes(0)
    })

    rerender(withAppContext(<ScrollComponent page={page2} />))

    jest.runAllTimers()

    await waitFor(() => {
      expect(scrollToMock).toHaveBeenCalledTimes(0)
    })

    rerender(withAppContext(<ScrollComponent page={page1} />))

    jest.runAllTimers()

    expect(scrollToMock).toHaveBeenCalledTimes(1)

    expect(scrollToMock).toHaveBeenCalledWith(0, 200)
  })
})
