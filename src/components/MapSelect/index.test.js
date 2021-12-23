// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import ZoomMessageControl from './control/ZoomMessageControl'
import LegendControl from './control/LegendControl'
import LoadingControl from './control/LoadingControl'
import ErrorControl from './control/ErrorControl'

import MapSelect from '.'

jest.mock('./control/ZoomMessageControl')
jest.mock('./control/LegendControl')
jest.mock('./control/LoadingControl')
jest.mock('./control/ErrorControl')

const fetchResponse = {
  type: 'FeatureCollection',
  name: 'klokken',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
  features: [
    {
      type: 'Feature',
      properties: {
        ogc_fid: '48634',
        type_id: '1',
        type_name: 'Klok',
        objectnummer: '065121',
      },
      geometry: { type: 'Point', coordinates: [4.883614, 52.37855] },
    },
    {
      type: 'Feature',
      properties: {
        ogc_fid: '93331',
        type_id: '1',
        type_name: 'Klok',
        objectnummer: '017431',
      },
      geometry: { type: 'Point', coordinates: [4.877793, 52.379065] },
    },
  ],
}

fetch.mockResponse(JSON.stringify(fetchResponse))

describe('<MapSelect />', () => {
  const legend = [{ key: 'klok', label: 'Klok', iconUrl: 'foo/bar/icon.svg' }]
  const onSelectionChange = jest.fn()
  const url = 'foo/geo.json?coordinates={north}{east}{south}{west}'
  const getIcon = (type, isSelected) => {
    if (isSelected) {
      return L.divIcon({ className: 'my-div-icon-select' })
    }

    return L.divIcon({ className: 'my-div-icon' })
  }

  const latlng = {
    lat: 4,
    lng: 52,
  }

  beforeEach(() => {
    jest.resetAllMocks()
    fetch.resetMocks()
  })

  it('should render correctly', async () => {
    const { findByTestId, getByTestId } = render(
      withAppContext(
        <MapSelect
          latlng={latlng}
          onSelectionChange={onSelectionChange}
          getIcon={getIcon}
          geojsonUrl={url}
          iconField="objecttype"
          idField="objectnummer"
          hasGPSControl
        />
      )
    )

    await findByTestId('mapSelect')

    expect(getByTestId('gpsButton')).toBeInTheDocument()
    expect(LegendControl).not.toHaveBeenCalled()
    expect(ZoomMessageControl.mock.instances[0].addTo).toHaveBeenCalled()
    expect(ErrorControl.mock.instances[0].addTo).toHaveBeenCalled()
    expect(LoadingControl.mock.instances[0].addTo).toHaveBeenCalled()
  })

  it('should render legend', async () => {
    const { findByTestId } = render(
      withAppContext(
        <MapSelect
          latlng={latlng}
          onSelectionChange={onSelectionChange}
          getIcon={getIcon}
          geojsonUrl={url}
          legend={legend}
          iconField="objecttype"
          idField="objectnummer"
        />
      )
    )

    await findByTestId('mapSelect')

    expect(LegendControl).toHaveBeenCalled()
  })

  it('should do bbox fetch', async () => {
    expect(fetch).not.toHaveBeenCalled()

    render(
      withAppContext(
        <MapSelect
          latlng={latlng}
          onSelectionChange={onSelectionChange}
          getIcon={getIcon}
          legend={legend}
          geojsonUrl={url}
          iconField="objectnummer"
          idField="objectnummer"
        />
      )
    )

    await screen.findByTestId('mapSelect')

    const coordinatesRegex = /coordinates=(\d{1,2}\.\d{1,16},?){4}$/
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(coordinatesRegex),
      undefined
    )
  })
})
