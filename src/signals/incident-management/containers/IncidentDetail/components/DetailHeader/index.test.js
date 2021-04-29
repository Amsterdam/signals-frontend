// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, fireEvent, act, screen } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import { withAppContext } from 'test/utils'
import { MAP_URL, INCIDENTS_URL } from 'signals/incident-management/routes'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import { PATCH_TYPE_THOR } from '../../constants'

import IncidentDetailContext from '../../context'
import DetailHeader from '.'

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

const renderWithContext = (incident = incidentFixture) =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ incident, update }}>
      <DetailHeader />
    </IncidentDetailContext.Provider>
  )

describe('signals/incident-management/containers/IncidentDetail/components/DetailHeader', () => {
  beforeEach(() => {
    update.mockReset()
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
      screen.queryAllByTestId('detail-header-button-download')
    ).toHaveLength(1)
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
