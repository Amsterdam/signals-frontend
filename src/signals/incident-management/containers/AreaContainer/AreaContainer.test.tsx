// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRouterDom from 'react-router-dom'

import type { Feature } from 'components/AreaMap/types'
import * as actions from 'containers/App/actions'
import { withAppContext } from 'test/utils'
import { StatusCode as mockStatusCode } from 'types/status-code'

import AreaContainer from '.'
import * as API from '../../../../../internals/testing/api'
import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../internals/testing/msw-server'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))
jest.spyOn(actions, 'showGlobalNotification')

const ID = '123'
const navigateSpy = jest.fn()
jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => navigateSpy)
jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
  id: ID,
}))

jest.mock('./components/Filter', () => () => (
  <div data-testid="filter">filter</div>
))
jest.mock(
  './components/IncidentDetail',
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

    expect(navigateSpy).toHaveBeenCalledWith(-1)
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

  it('should show error message on error', async () => {
    mockRequestHandler({
      status: 500,
      url: API.INCIDENT_CONTEXT_GEOGRAPHY,
      body: { detail: 'Internal server error' },
    })

    render(withAppContext(<AreaContainer />))

    await waitFor(() => {
      expect(actions.showGlobalNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'De data kon niet worden opgehaald',
        })
      )
    })
  })
})
