// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import {act, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import {formatAddress} from 'shared/services/format-address'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import {withAppContext} from 'test/utils'

import {get, mockFilters, mockIncidents, mockUseMapInstance, useFetchResponse} from '../__test__'
import {IncidentMap} from './IncidentMap'
import {useEffect} from "react";


jest.mock('@amsterdam/react-maps', () => ({
  __esModule: true,
  ...jest.requireActual('@amsterdam/react-maps'),
  useMapInstance: jest.fn(() => mockUseMapInstance),
}))



jest.mock('../FilterPanel', () => ({
  __esModule: true,
  ...jest.requireActual('../FilterPanel'),
  FilterPanel: ({setFilters, ...rest}: any) => {
    setFilters(mockFilters)
    return <div {...rest}>[Filter Panel]</div>
  }
}))

jest.mock('./styled', () => ({
  ...jest.requireActual('./styled'),
  StyledPDOKAutoSuggest: ({value, ...rest}: any) => {
    return <div {...rest}>{value}</div>
  },
}))

const coords = {
  lat: 52.3731081,
  lng: 4.8932945,
}

const mockPdokAddress = {
  huisnummer: '178',
  openbare_ruimte: 'Warmoesstraat',
  postcode: '1012JK',
  woonplaats: 'Amsterdam',
}

const mockPdokResponse = {
  id: 1,
  value: 'mockValue',
  data: {
    location: coords,
    address: mockPdokAddress,
  },
}

jest.mock('hooks/useFetch')
jest.mock('shared/services/reverse-geocoder')
jest.mocked(reverseGeocoderService).mockImplementation(async () => {
  return mockPdokResponse
})

describe('IncidentMap', () => {
  beforeEach(() => {
    get.mockReset()
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
  })

  it('should render the incident map correctly', () => {

    render(withAppContext(<IncidentMap/>))

    expect(screen.getByTestId('incidentMap')).toBeInTheDocument()
    expect(screen.getByTestId('gpsButton')).toBeInTheDocument()
    expect(screen.getByText('[Filter Panel]')).toBeInTheDocument()
  })

  it('sends a request to fetch publicly available incidents', () => {
    render(withAppContext(<IncidentMap/>))

    expect(get).toHaveBeenCalledWith(
      expect.stringContaining(configuration.GEOGRAPHY_PUBLIC_ENDPOINT)
    )
  })

  it('shows a message when the API returns an error', () => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      error: new Error(),
    }))

    render(withAppContext(<IncidentMap/>))

    expect(
      screen.getByText('Er konden geen meldingen worden opgehaald.')
    ).toBeInTheDocument()
  })

  it('sets the address when coordinates change', async () => {
    const coords = {
      accuracy: 1234,
      latitude: 52.3731081,
      longitude: 4.8932945,
    }
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) =>
        Promise.resolve(
          success({
            coords,
          })
        )
      ),
    }

    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
    })

    render(withAppContext(<IncidentMap/>))
    expect(screen.getByTestId('gpsButton')).toBeInTheDocument()

    await act(async () => {
      userEvent.click(screen.getByTestId('gpsButton'))
    })

    expect(screen.getByTestId('searchAddressBar')).toHaveValue(
      formatAddress(mockPdokAddress)
    )
  })

  it('should close the error message when close button is clicked', () => {
    jest.mocked(useFetch).mockImplementationOnce(() => ({
      ...useFetchResponse,
      error: new Error(),
    }))

    render(withAppContext(<IncidentMap/>))
    expect(
      screen.queryByText('Er konden geen meldingen worden opgehaald.')
    ).toBeInTheDocument()

    const closeButton = screen.getByTestId('closeMessage')

    expect(closeButton).toBeInTheDocument()

    userEvent.click(closeButton)

    expect(
      screen.queryByText('Er konden geen meldingen worden opgehaald.')
    ).not.toBeInTheDocument()
  })

  it('zooms in on incident when selected', () => {
    /*
    arrange:
    1. render map with incidents and draweroverlay panel
    2. set state to mobile // const window.innerWidth = 384 // width when mobile
    3. close DrawerOverlay panel
    act:
    1. click on incident that would be under draweroverlay panel
    assert:
    1. Selected pin is visible and draweroverlay as well
     */
    const mockedData = {
      type: "FeatureCollection",
      features: mockIncidents
    }

    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      data: mockedData,
      isLoading: false,
      isSuccess: true,
    }))

    render(withAppContext(<IncidentMap/>))

    screen.debug()
    expect(screen.getByTestId('incidentMap')).toBeInTheDocument()
    expect(screen.getByTestId('searchAddressBar')).toBeInTheDocument()
    expect(screen.getByText('Even wat tekst opschrijven')).toBeInTheDocument()
    expect(screen.getByText('[Filter Panel]')).toBeInTheDocument()

  })

  it('closes the draweroverlay panel when an address is selected and the app is in mobile state', () => {
    /*PvA
    arrange:
    1. render map with incidents on it and a Draweroverlay panel
    2. zet app op mobile --const getDeviceMode(window.innerWidth) = DeviceMode.Mobile
    act:
    1. klik op een marker
    assert:
    1. is DrawerOverlay niet meer in DOM
     */
    // const getDeviceMode(window.innerWidth) = DeviceMode.Mobile

    render(withAppContext(<IncidentMap/>))

    userEvent.click(screen.getByAltText('Veeg- / zwerfvuil'))
    expect(screen.getByText('Zoom naar adres')).toBeInTheDocument()

    // expect(defaultProps.setCoordinates).toHaveBeenCalledWith(coords)
    // expect(defaultProps.setDrawerState).toHaveBeenCalledWith(DrawerState.Closed)
  })
})
