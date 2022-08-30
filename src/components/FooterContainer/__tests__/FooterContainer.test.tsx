// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import configuration from 'shared/services/configuration/configuration'

import { Provider } from 'react-redux'
import { history } from 'test/utils'
import { getIsAuthenticated } from 'shared/services/auth/auth'
import { mocked } from 'jest-mock'
import Footer from '..'
import configureStore from '../../../configureStore'

let mockIsIncidentMap = false
jest.mock('hooks/useIsIncidentMap', () => {
  return jest.fn(() => mockIsIncidentMap)
})

jest.mock('shared/services/configuration/configuration')
jest.mock('shared/services/auth/auth')
const mockedGetIsAuthenticated = mocked(getIsAuthenticated, false)

configuration.links.privacy = 'https://www.amsterdam.nl/privacy/'
configuration.links.about = 'https://www.amsterdam.nl/overdezesite/'
configuration.links.accessibility = '/toegankelijkheid/'

describe('<FooterContainer />', () => {
  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
  })

  it('should render correctly', () => {
    render(
      <Provider store={configureStore({}, history)}>
        {withAppContext(<Footer />)}
      </Provider>
    )
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      configuration.links.privacy
    )
    expect(
      screen.getByRole('link', { name: 'Over deze site' })
    ).toHaveAttribute('href', configuration.links.about)
    expect(
      screen.getByRole('link', { name: 'Toegankelijkheid' })
    ).toHaveAttribute('href', configuration.links.accessibility)
  })

  it('should render a single div when application opened in the amsterdam.app', () => {
    configuration.featureFlags.appMode = true

    const { container } = render(
      <Provider store={configureStore({}, history)}>
        {withAppContext(<Footer />)}
      </Provider>
    )

    expect(container.firstChild).toBeEmptyDOMElement()
  })

  it('should render null when authenticated', () => {
    mockedGetIsAuthenticated.mockImplementation(() => true)

    const { container } = render(
      <Provider store={configureStore({}, history)}>
        {withAppContext(<Footer />)}
      </Provider>
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render null when incidentMap is rendered', () => {
    mockedGetIsAuthenticated.mockImplementation(() => false)
    mockIsIncidentMap = true

    const { container } = render(
      <Provider store={configureStore({}, history)}>
        {withAppContext(<Footer />)}
      </Provider>
    )

    expect(container.firstChild).toBeNull()
  })
})
