// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import 'jest-styled-components'
import * as reactResponsive from 'react-responsive'

import * as auth from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import { history, withAppContext } from 'test/utils'

import { SiteHeader } from './SiteHeader'
import type { Props } from './SiteHeader'

jest.mock('react-responsive')
jest.mock('shared/services/auth/auth')
jest.mock('shared/services/configuration/configuration')

const onLogOut = jest.fn()

const showItems = {
  categories: false,
  defaultTexts: false,
  departments: false,
  settings: false,
  groups: false,
  users: false,
}

const defaultProps: Props = {
  onLogOut,
  showItems,
}

describe('components/SiteHeader', () => {
  beforeEach(() => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(false)
  })

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
  })

  it('should render correctly when not authenticated', () => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    act(() => {
      history.push('/')
    })

    const { container, rerender, queryByText, unmount } = render(
      withAppContext(<SiteHeader {...defaultProps} />)
    )

    // menu items
    expect(queryByText('Melden')).not.toBeInTheDocument()
    expect(queryByText('Help')).not.toBeInTheDocument()

    // inline menu should not be visible
    expect(container.querySelectorAll('ul[aria-hidden="true"]')).toHaveLength(0)

    unmount()

    // narrow window toggle
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)

    act(() => {
      history.push('/manage')
    })

    rerender(withAppContext(<SiteHeader {...defaultProps} />))

    expect(queryByText('Melden')).toBeNull()

    expect(container.querySelector('#header')).toHaveStyleRule('z-index: 2')
  })

  it('should render Dashboard when featureflag showDashboard is true', () => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)
    configuration.featureFlags.showDashboard = true
    const { rerender, unmount } = render(
      withAppContext(<SiteHeader {...defaultProps} />)
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Signalering')).not.toBeInTheDocument()

    unmount()
    configuration.featureFlags.showDashboard = false
    rerender(withAppContext(<SiteHeader {...defaultProps} />))

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.getByText('Signalering')).toBeInTheDocument()
  })

  it('should render correctly when authenticated', () => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    const props = {
      ...defaultProps,
      showItems: {
        ...defaultProps.showItems,
        settings: true,
        groups: true,
        users: true,
      },
    }

    act(() => {
      history.push('/')
    })

    const { container, queryByText, unmount } = render(
      withAppContext(<SiteHeader {...props} />)
    )

    // menu items
    expect(queryByText('Melden')).toBeInTheDocument()
    expect(queryByText('Help')).toBeInTheDocument()
    expect(queryByText('Instellingen')).toBeInTheDocument()

    expect(container.querySelector('#header')).toHaveStyleRule('z-index: 2')

    unmount()

    // narrow window toggle
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)

    act(() => {
      history.push('/manage')
    })

    render(withAppContext(<SiteHeader {...defaultProps} />))
  })

  it('should render the correct homeLink', () => {
    const homeLink = 'https://home'
    configuration.links.home = homeLink

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    const { container, rerender, unmount } = render(
      withAppContext(<SiteHeader {...defaultProps} />)
    )

    expect(
      container.querySelector(`div a[href="${homeLink}"]`)
    ).toBeInTheDocument()

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    unmount()

    rerender(withAppContext(<SiteHeader {...defaultProps} />))

    expect(container.querySelector('div a[href="/"]')).toBeInTheDocument()

    unmount()

    rerender(withAppContext(<SiteHeader {...defaultProps} />))

    expect(container.querySelector('div a[href="/"]')).toBeInTheDocument()
  })

  it('should render a title', () => {
    const title = 'Signals'
    const authTitle = 'Signals Auth'
    configuration.language.headerTitle = title
    configuration.language.smallHeaderTitle = authTitle

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    act(() => {
      history.push('/')
    })

    const { rerender, unmount } = render(
      withAppContext(<SiteHeader {...defaultProps} />)
    )

    // don't show auth title in front office when not authenticated
    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.queryByText(authTitle)).not.toBeInTheDocument()

    unmount()

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    act(() => {
      history.push('/')
    })

    rerender(withAppContext(<SiteHeader {...defaultProps} />))

    // do show auth title in front office when authenticated
    expect(screen.queryByText(title)).not.toBeInTheDocument()
    expect(screen.getByText(authTitle)).toBeInTheDocument()

    unmount()

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    act(() => {
      history.push('/manage')
    })

    rerender(withAppContext(<SiteHeader {...defaultProps} />))

    // don't show auth title in back office when not authenticated
    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.queryByText(authTitle)).not.toBeInTheDocument()

    unmount()

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    rerender(withAppContext(<SiteHeader {...defaultProps} />))

    // do show title in back office when authenticated
    expect(screen.queryByText(title)).not.toBeInTheDocument()
    expect(screen.getByText(authTitle)).toBeInTheDocument()
  })

  it('should render a tall header', () => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    act(() => {
      history.push('/')
    })

    const { rerender, unmount } = render(
      withAppContext(<SiteHeader {...defaultProps} />)
    )

    expect(
      screen.getByTestId('site-header').classList.contains('isTall')
    ).toEqual(true)

    unmount()

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    rerender(withAppContext(<SiteHeader {...defaultProps} />))

    expect(
      screen.getByTestId('site-header').classList.contains('isShort')
    ).toEqual(true)

    unmount()

    act(() => {
      history.push('/manage')
    })

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    rerender(withAppContext(<SiteHeader {...defaultProps} />))

    expect(
      screen.getByTestId('site-header').classList.contains('isTall')
    ).toEqual(true)

    unmount()

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    rerender(withAppContext(<SiteHeader {...defaultProps} />))

    expect(
      screen.getByTestId('site-header').classList.contains('isShort')
    ).toEqual(true)
  })

  it('should render a tall header by default', () => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    render(withAppContext(<SiteHeader {...defaultProps} />))

    act(() => {
      history.push('/mijn-meldingen')
    })

    expect(
      screen.getByTestId('site-header').classList.contains('isTall')
    ).toEqual(true)

    act(() => {
      history.push('/')
    })

    expect(
      screen.getByTestId('site-header').classList.contains('isTall')
    ).toEqual(false)
  })

  it('should show buttons based on permissions', () => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    const props = {
      ...defaultProps,
      showItems: {
        ...defaultProps.showItems,
        defaultTexts: true,
      },
    }

    const { queryByText } = render(withAppContext(<SiteHeader {...props} />))

    expect(queryByText('Standaard teksten')).toBeInTheDocument()
  })

  it('should render correctly when logged in', () => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    const { container, queryByText } = render(
      withAppContext(<SiteHeader {...defaultProps} />)
    )

    // Overzicht menu item
    expect(queryByText('Overzicht')).toBeInTheDocument()

    // search field
    expect(container.querySelector('input')).toBeInTheDocument()

    // log out button
    expect(queryByText('Uitloggen')).toBeInTheDocument()
  })

  it('should handle logout callback', () => {
    act(() => {
      history.push('/')
    })

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    const { getByText } = render(
      withAppContext(<SiteHeader {...defaultProps} />)
    )

    const logOutButton = getByText('Uitloggen')

    expect(onLogOut).not.toHaveBeenCalled()

    act(() => {
      userEvent.click(logOutButton)
    })

    expect(onLogOut).toHaveBeenCalled()
  })

  it('should hide the menu when clicking a link', async () => {
    // narrow window toggle
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(true)

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    const props = {
      ...defaultProps,
      showItems: {
        ...defaultProps.showItems,
        settings: true,
        groups: true,
        users: true,
      },
    }

    render(withAppContext(<SiteHeader {...props} />))

    const toggle = screen.getByRole('button')

    expect(
      screen.queryByRole('link', { name: 'Instellingen' })
    ).not.toBeInTheDocument()

    userEvent.click(toggle)

    const link = screen.getByRole('link', { name: 'Instellingen' })
    expect(link).toBeInTheDocument()

    userEvent.click(link)

    await waitFor(() => {
      expect(
        screen.queryByRole('link', { name: 'Instellingen' })
      ).not.toBeInTheDocument()
    })
  })
})
