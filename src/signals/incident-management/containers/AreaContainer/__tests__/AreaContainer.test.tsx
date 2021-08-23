// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import * as reactRouterDom from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import userEvent from '@testing-library/user-event'
import { INCIDENT_URL } from 'signals/incident-management/routes'
import { Feature } from 'components/AreaMap/types'
import { StatusCode as mockStatusCode } from 'signals/incident-management/definitions/statusList'
import { fetchMock } from '../../../../../../internals/testing/msw-server'
import AreaContainer from '..'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const ID = '123'
const pushSpy = jest.fn()
const useHistorySpy = { push: pushSpy } as any
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => useHistorySpy)
jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
  id: ID,
}))

jest.mock('../components/Filter', () => () => (
  <div data-testid="filter">filter</div>
))
jest.mock(
  '../components/IncidentDetail',
  () =>
    ({ onBack }: { onBack: () => void }) => {
      return (
        <div data-testid="incident">
          <button data-testid="incident-back-button" onClick={() => onBack()}>
            back
          </button>
        </div>
      )
    }
)
jest.mock(
  'components/AreaMap',
  () =>
    ({
      onClick,
      onClose,
    }: {
      onClick: (p: Feature) => void
      onClose: () => void
    }) => {
      const feature: Feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [125.6, 10.1],
        },
        properties: {
          id: 1234,
          created_at: '',
          status: { state: mockStatusCode.Gemeld, state_display: '' },
        },
      }

      return (
        <div data-testid="area-map">
          Leaflet
          <button
            data-testid="incident-marker"
            onClick={() => onClick(feature)}
          >
            incident
          </button>
          <button data-testid="map-close-button" onClick={() => onClose()}>
            close
          </button>
        </div>
      )
    }
)

fetchMock.disableMocks()

describe('<AreaContainer />', () => {
  it('renders a map', async () => {
    render(withAppContext(<AreaContainer />))

    await screen.findByText('Leaflet')
  })

  it('handles navigation to parent incident', async () => {
    render(withAppContext(<AreaContainer />))

    const closeButton = await screen.findByTestId('map-close-button')

    userEvent.click(closeButton)

    expect(pushSpy).toHaveBeenCalledWith(`${INCIDENT_URL}/${ID}`)
  })

  it('should show the incident bar when a marker has been selected', async () => {
    render(withAppContext(<AreaContainer />))

    const incidentMarker = await screen.findByTestId('incident-marker')

    userEvent.click(incidentMarker)

    const incident = await screen.findByTestId('incident')
    expect(incident).toBeInTheDocument()
  })

  it('should show the filter bar when a marker has been selected and is closed', async () => {
    render(withAppContext(<AreaContainer />))

    const incidentMarker = await screen.findByTestId('incident-marker')

    userEvent.click(incidentMarker)

    const incident = await screen.findByTestId('incident')
    expect(incident).toBeInTheDocument()

    const backButton = await screen.findByTestId('incident-back-button')

    userEvent.click(backButton)

    const filter = await screen.findByTestId('filter')
    expect(filter).toBeInTheDocument()
  })
})
