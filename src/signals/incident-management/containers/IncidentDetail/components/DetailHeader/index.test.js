// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import { render, fireEvent, act, screen } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import configuration from 'shared/services/configuration/configuration'
import { MAP_URL, INCIDENTS_URL } from 'signals/incident-management/routes'
import { withAppContext } from 'test/utils'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'

import DetailHeader from '.'
import { PATCH_TYPE_THOR } from '../../constants'
import IncidentDetailContext from '../../context'

jest.mock('shared/services/configuration/configuration')

jest.mock('./components/DownloadButton', () => (props) => (
  <div data-testid="detail-header-button-download" {...props} />
))

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    referrer: undefined,
  }),
}))

const update = jest.fn()
const toggleExternal = jest.fn()

const renderWithContext = (incident = incidentFixture) =>
  withAppContext(
    <IncidentDetailContext.Provider
      value={{ incident, update, toggleExternal }}
    >
      <DetailHeader />
    </IncidentDetailContext.Provider>
  )

describe('signals/incident-management/containers/IncidentDetail/components/DetailHeader', () => {
  beforeEach(() => {
    configuration.featureFlags.showThorButton = true
    configuration.featureFlags.enableForwardIncidentToExternal = true
    update.mockReset()
  })

  afterEach(() => {
    configuration.__reset()
  })

  it('should render all buttons when state is gemeld and no parent or children are present', () => {
    render(
      renderWithContext({
        ...incidentFixture,
        _links: {
          ...incidentFixture._links,
          'sia:children': undefined,
        },
      })
    )

    expect(screen.queryByTestId('backlink')).toHaveTextContent(
      /^Terug naar overzicht$/
    )
    expect(screen.queryByTestId('detail-header-title')).toHaveTextContent(
      `Standaardmelding ${incidentFixture.id}`
    )
    expect(screen.queryByTestId('detail-header-button-thor')).toHaveTextContent(
      /^THOR$/
    )
    expect(
      screen.queryByTestId('detail-header-button-external')
    ).toHaveTextContent(/^Extern$/)
    expect(
      screen.queryAllByTestId('detail-header-button-download')
    ).toHaveLength(1)
  })

  it('should not render THOR button when feature flag disable', () => {
    configuration.featureFlags.showThorButton = false

    render(
      renderWithContext({
        ...incidentFixture,
        _links: {
          ...incidentFixture._links,
          'sia:children': undefined,
        },
      })
    )

    expect(
      screen.queryByTestId('detail-header-button-thor')
    ).not.toBeInTheDocument()
  })

  it('should not render Extern button when feature flag is disabled', () => {
    configuration.featureFlags.enableForwardIncidentToExternal = false

    render(renderWithContext(incidentFixture))

    expect(
      screen.queryByTestId('detail-header-button-external')
    ).not.toBeInTheDocument()
  })

  it('should render correct title when parent is present', () => {
    render(
      renderWithContext({
        ...incidentFixture,
        _links: {
          'sia:children': undefined,
          'sia:parent': { href: '//href-to-parent/5678' },
        },
      })
    )

    expect(screen.queryByTestId('detail-header-title')).toHaveTextContent(
      `Deelmelding ${incidentFixture.id}`
    )
  })

  it('should render correct title when children are present', () => {
    render(
      renderWithContext({
        ...incidentFixture,
        _links: { 'sia:parent': undefined, 'sia:children': [...Array(8)] },
      })
    )

    expect(screen.queryByTestId('detail-header-title')).toHaveTextContent(
      `Hoofdmelding ${incidentFixture.id}`
    )
  })

  it('should render no split button when 10 or more children are present', () => {
    const { rerender } = render(renderWithContext())

    expect(
      screen.queryByTestId('detail-header-button-split')
    ).toBeInTheDocument()

    rerender(
      renderWithContext({
        ...incidentFixture,
        _links: {
          ...incidentFixture._links,
          'sia:parent': undefined,
          'sia:children': [...Array(8)],
        },
      })
    )

    expect(
      screen.queryByTestId('detail-header-button-split')
    ).toBeInTheDocument()

    rerender(
      renderWithContext({
        ...incidentFixture,
        _links: {
          ...incidentFixture._links,
          'sia:parent': undefined,
          'sia:children': [...Array(10)],
        },
      })
    )

    expect(
      screen.queryByTestId('detail-header-button-split')
    ).not.toBeInTheDocument()
  })

  it('should render no split button when parent is present', () => {
    render(
      renderWithContext({
        ...incidentFixture,
        _links: {
          ...incidentFixture._links,
          'sia:parent': { href: '//href-to-parent/5678' },
        },
      })
    )

    expect(screen.queryByTestId('detail-header-button-split')).toBeNull()
  })

  it('should render no split button when state is o, a or s', () => {
    ;['o', 'a', 's'].forEach((state) => {
      render(
        renderWithContext({
          ...incidentFixture,
          status: { ...incidentFixture.status, state },
        })
      )

      expect(screen.queryByTestId('detail-header-button-split')).toBeNull()
    })
  })

  it('should render no thor button when state is not m, i, b, h, send failed or reopened', () => {
    render(
      renderWithContext({
        ...incidentFixture,
        status: { ...incidentFixture.status, state: 'o' },
      })
    )

    expect(screen.queryByTestId('detail-header-button-thor')).toBeNull()
  })

  it('test clicking the thor button', () => {
    render(renderWithContext())

    expect(update).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(screen.queryByTestId('detail-header-button-thor'))
    })

    expect(update).toHaveBeenCalledWith({
      type: PATCH_TYPE_THOR,
      patch: {
        status: {
          state: 'ready to send',
          text: 'Te verzenden naar THOR',
          target_api: 'sigmax',
        },
      },
    })
  })

  it('should render no Extern button when status is "o" or "a"', () => {
    const { rerender } = render(
      renderWithContext({
        ...incidentFixture,
        status: { ...incidentFixture.status, state: 'o' },
      })
    )

    expect(
      screen.queryByTestId('detail-header-button-external')
    ).not.toBeInTheDocument()

    rerender(
      renderWithContext({
        ...incidentFixture,
        status: { ...incidentFixture.status, state: 'a' },
      })
    )

    expect(
      screen.queryByTestId('detail-header-button-external')
    ).not.toBeInTheDocument()
  })

  it('should toggle external when Extern button is clicked', () => {
    render(renderWithContext())

    expect(toggleExternal).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(screen.queryByTestId('detail-header-button-external'))
    })

    expect(toggleExternal).toHaveBeenCalled()
  })

  it('should render a link with the correct referrer', () => {
    const { rerender } = render(renderWithContext())

    expect(screen.getByTestId('backlink').href).toEqual(
      expect.stringContaining(INCIDENTS_URL)
    )

    const referrer = '/some-url'
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      referrer,
    }))

    rerender(renderWithContext())

    expect(screen.getByTestId('backlink').href).toEqual(
      expect.stringContaining(INCIDENTS_URL)
    )

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      referrer: MAP_URL,
    }))

    rerender(renderWithContext())

    expect(screen.getByTestId('backlink').href).toEqual(
      expect.stringContaining(MAP_URL)
    )
  })
})
