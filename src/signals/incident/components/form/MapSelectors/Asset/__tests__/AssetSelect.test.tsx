// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useContext as mockUseContext } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import incidentJson from 'utils/__tests__/fixtures/incident.json'
import { withAppContext } from 'test/utils'
import mockAssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import { mocked } from 'ts-jest/utils'

import type { Location } from 'types/incident'
import type { AssetSelectProps } from '../AssetSelect'

import AssetSelect from '..'
import { initialValue } from '../context'
import { withAssetSelectContext } from './context.test'

const mockLatLng = { lat: 10, lng: 20 }

jest.mock('shared/services/reverse-geocoder')

jest.mock('../Selector', () => () => {
  const { setLocation, close } = mockUseContext(mockAssetSelectContext)

  return (
    <>
      <span
        aria-hidden="true"
        data-testid="assetSelectSelector"
        onClick={() => setLocation(mockLatLng)}
        role="button"
        tabIndex={0}
      />
      <span
        aria-hidden="true"
        data-testid="mapCloseButton"
        onClick={close}
        role="button"
        tabIndex={0}
      />
    </>
  )
})

describe('AssetSelect', () => {
  let props: AssetSelectProps
  const updateIncident = jest.fn()
  const location = incidentJson.location as unknown as Location

  beforeEach(() => {
    props = {
      handler: () => ({
        value: [],
      }),
      meta: {
        ...initialValue.meta,
        name: 'Zork',
      },
      parent: {
        meta: {
          incidentContainer: { incident: { location } },
          updateIncident,
        },
      },
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the Intro', () => {
    render(withAppContext(<AssetSelect {...props} />))

    expect(screen.queryByTestId('assetSelectIntro')).toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSelector')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSummary')).not.toBeInTheDocument()
  })

  it('should render the Selector', () => {
    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))

    expect(screen.queryByTestId('assetSelectIntro')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSelector')).toBeInTheDocument()
  })

  it('should close the selector component', () => {
    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))

    expect(screen.queryByTestId('assetSelectSelector')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('mapCloseButton'))

    expect(screen.queryByTestId('assetSelectSelector')).not.toBeInTheDocument()
  })

  it('should render the Summary', () => {
    render(
      withAppContext(
        <AssetSelect
          {...{
            ...props,
            handler: () => ({
              value: [
                {
                  id: 'PL734',
                  type: 'plastic',
                  description: 'Plastic asset',
                  iconUrl: '',
                },
              ],
            }),
          }}
        />
      )
    )

    expect(screen.queryByTestId('assetSelectIntro')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSelector')).not.toBeInTheDocument()
    expect(screen.queryByTestId('assetSelectSummary')).toBeInTheDocument()
  })

  it('handles setLocation for a successful reverse geocode request', async () => {
    const geocodedResponse = {
      id: 'foo',
      value: 'bar',
      data: {
        location: {
          lat: 52.37377195,
          lng: 4.87745608,
        },
        address: {
          openbare_ruimte: '',
          huisnummer: '189A-2',
          postcode: '1016KP',
          woonplaats: 'Amsterdam',
        },
      },
    }
    mocked(reverseGeocoderService).mockImplementation(() =>
      Promise.resolve(geocodedResponse)
    )

    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))

    const assetSelectSelector = screen.getByTestId('assetSelectSelector')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(assetSelectSelector)

    expect(updateIncident).toHaveBeenCalledTimes(1)
    expect(updateIncident).toHaveBeenCalledWith({ Zork: [] })

    await screen.findByTestId('assetSelectSelector')

    expect(updateIncident).toHaveBeenCalledTimes(2)
    expect(updateIncident).toHaveBeenLastCalledWith({
      location: expect.objectContaining({
        geometrie: expect.objectContaining({ type: 'Point' }),
        address: geocodedResponse.data.address,
      }),
    })
  })

  it('handles setLocation for a unsuccessful reverse geocode request', async () => {
    const geocodedResponse = undefined

    mocked(reverseGeocoderService).mockImplementation(() =>
      Promise.resolve(geocodedResponse)
    )

    render(withAssetSelectContext(<AssetSelect {...props} />))

    userEvent.click(screen.getByText(/kies op kaart/i))

    const assetSelectSelector = screen.getByTestId('assetSelectSelector')

    expect(updateIncident).not.toHaveBeenCalled()

    userEvent.click(assetSelectSelector)

    expect(updateIncident).toHaveBeenCalledTimes(1)
    expect(updateIncident).toHaveBeenCalledWith({ Zork: [] })

    await screen.findByTestId('assetSelectSelector')

    expect(updateIncident).toHaveBeenCalledTimes(1)
  })
})
