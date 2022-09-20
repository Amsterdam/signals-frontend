// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { render, act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import 'jest-styled-components'
import * as reactResponsive from 'react-responsive'

import * as auth from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import { history, withAppContext } from 'test/utils'

import SiteHeader from '.'

let mockIsIncidentMap = false
jest.mock('hooks/useIsIncidentMap', () => {
  return jest.fn(() => mockIsIncidentMap)
})

jest.mock('react-responsive')
jest.mock('shared/services/auth/auth')
jest.mock('shared/services/configuration/configuration')

describe('components/SiteHeader', () => {
  beforeEach(() => {
    jest.spyOn(reactResponsive, 'useMediaQuery').mockReturnValue(false)
  })

  afterEach(() => {
    configuration.__reset()
  })

  it('should render correctly when not authenticated', () => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    act(() => {
      history.push('/')
    })

    const { container, rerender, queryByText, unmount } = render(
      withAppContext(<SiteHeader />)
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

    rerender(withAppContext(<SiteHeader />))

    expect(queryByText('Melden')).toBeNull()

    expect(container.querySelector('#header')).toHaveStyleRule('z-index: 2')
  })

  it('should render correctly when authenticated', () => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    act(() => {
      history.push('/')
    })

    const { container, queryByText, unmount } = render(
      withAppContext(
        <SiteHeader showItems={{ settings: true, users: true, groups: true }} />
      )
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

    render(
      withAppContext(
        <SiteHeader showItems={{ settings: true, users: true, groups: true }} />
      )
    )
  })

  it('should render the correct homeLink', () => {
    const homeLink = 'https://home'
    configuration.links.home = homeLink

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    const { container, rerender, unmount } = render(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/' }} />
      )
    )

    expect(
      container.querySelector(`div a[href="${homeLink}"]`)
    ).toBeInTheDocument()

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    unmount()

    rerender(
      withAppContext(
        <SiteHeader permissions={[]} location={{ pathname: '/' }} />
      )
    )

    expect(container.querySelector('div a[href="/"]')).toBeInTheDocument()

    unmount()

    rerender(
      withAppContext(
        <SiteHeader
          permissions={[]}
          location={{ pathname: '/manage/incidents' }}
        />
      )
    )

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

    const { rerender, unmount } = render(withAppContext(<SiteHeader />))

    // don't show auth title in front office when not authenticated
    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.queryByText(authTitle)).not.toBeInTheDocument()

    unmount()

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    act(() => {
      history.push('/')
    })

    rerender(withAppContext(<SiteHeader />))

    // do show auth title in front office when authenticated
    expect(screen.queryByText(title)).not.toBeInTheDocument()
    expect(screen.getByText(authTitle)).toBeInTheDocument()

    unmount()

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    act(() => {
      history.push('/manage')
    })

    rerender(withAppContext(<SiteHeader />))

    // don't show auth title in back office when not authenticated
    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.queryByText(authTitle)).not.toBeInTheDocument()

    unmount()

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    rerender(withAppContext(<SiteHeader />))

    // do show title in back office when authenticated
    expect(screen.queryByText(title)).not.toBeInTheDocument()
    expect(screen.getByText(authTitle)).toBeInTheDocument()
  })

  it('should render a tall header', () => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    act(() => {
      history.push('/')
    })

    const { container, rerender, unmount } = render(
      withAppContext(<SiteHeader location={{ pathname: '/' }} />)
    )

    expect(
      container.querySelector('.siteHeader').classList.contains('isTall')
    ).toEqual(true)

    unmount()

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    rerender(withAppContext(<SiteHeader />))

    expect(
      container.querySelector('.siteHeader').classList.contains('isShort')
    ).toEqual(true)

    unmount()

    act(() => {
      history.push('/manage')
    })

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    rerender(withAppContext(<SiteHeader />))

    expect(
      container.querySelector('.siteHeader').classList.contains('isTall')
    ).toEqual(true)

    unmount()

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    rerender(withAppContext(<SiteHeader />))

    expect(
      container.querySelector('.siteHeader').classList.contains('isShort')
    ).toEqual(true)
  })

  it('should show buttons based on permissions', () => {
    const { queryByText } = render(
      withAppContext(
        <SiteHeader
          showItems={{ defaultTexts: true }}
          location={{ pathname: '/incident/beschrijf' }}
        />
      )
    )

    expect(queryByText('Standaard teksten')).toBeInTheDocument()
  })

  it('should render correctly when logged in', () => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)

    const { container, queryByText } = render(
      withAppContext(<SiteHeader location={{ pathname: '/' }} />)
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

    const onLogOut = jest.fn()

    const { getByText } = render(
      withAppContext(<SiteHeader onLogOut={onLogOut} />)
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

    render(
      withAppContext(
        <SiteHeader showItems={{ settings: true, users: true, groups: true }} />
      )
    )

    const toggle = screen.getByRole('button', { 'aria-label': 'Menu' })

    expect(
      screen.queryByRole('link', { name: 'Instellingen' })
    ).not.toBeInTheDocument()

    userEvent.click(toggle)

    const link = screen.queryByRole('link', { name: 'Instellingen' })
    expect(link).toBeInTheDocument()

    userEvent.click(link)

    await waitFor(() => {
      expect(
        screen.queryByRole('link', { name: 'Instellingen' })
      ).not.toBeInTheDocument()
    })
  })

  it('should render null when incidentMap is rendered', () => {
    mockIsIncidentMap = true

    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

    const { container } = render(withAppContext(<SiteHeader />))

    expect(container.firstChild).toBeNull()
  })
})
