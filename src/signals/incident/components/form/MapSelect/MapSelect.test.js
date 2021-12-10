// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'
import MapSelect from './MapSelect'

jest.mock('shared/services/configuration/configuration')

const jsonResponse = {
  type: 'FeatureCollection',
  name: 'verlichting',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
  features: [
    {
      type: 'Feature',
      properties: {
        ogc_fid: '1845',
        objecttype: '5',
        type_name: 'Grachtmast',
        objectnummer: '002635',
      },
      geometry: { type: 'Point', coordinates: [4.896506, 52.370984] },
    },
    {
      type: 'Feature',
      properties: {
        ogc_fid: '1882',
        objecttype: '5',
        type_name: 'Grachtmast',
        objectnummer: '147329',
      },
      geometry: { type: 'Point', coordinates: [4.895565, 52.371467] },
    },
  ],
}

const parent = {
  meta: {
    updateIncident: jest.fn(),
    incidentContainer: {
      incident: {
        location: {
          geometrie: {
            type: 'Point',
            coordinates: [4, 25],
          },
        },
      },
    },
  },
}

const meta = {
  name: 'my_question',
  idField: 'idField',
  isVisible: true,
  endpoint: 'foo/bar?',
  legend_items: ['klok'],
}

const handler = () => ({ value: 'foo' })

describe('signals/incident/components/form/MapSelect', () => {
  it('should render the map component', () => {
    const { container, queryByTestId, rerender } = render(
      withAppContext(
        <MapSelect parent={parent} meta={meta} handler={handler} />
      )
    )

    expect(queryByTestId('mapSelect')).toBeInTheDocument()
    expect(queryByTestId('gpsButton')).toBeInTheDocument()
    expect(container.firstChild.classList.contains('mapSelect')).toBeTruthy()

    rerender(
      withAppContext(
        <MapSelect
          parent={parent}
          meta={{ ...meta, isVisible: false }}
          handler={handler}
        />
      )
    )

    expect(queryByTestId('mapSelect')).not.toBeInTheDocument()
  })

  it('should render selected item numbers', () => {
    const { getByText } = render(
      withAppContext(
        <MapSelect
          parent={parent}
          meta={meta}
          handler={() => ({ value: ['9673465', '808435'] })}
        />
      )
    )

    expect(
      getByText('Gekozen op de kaart: 9673465; 808435')
    ).toBeInTheDocument()
  })

  it('should call parent.meta.updateIncident', async () => {
    fetch.mockResponse(JSON.stringify(jsonResponse))

    const value = ['002635', '147329']
    const { container, findByTestId } = render(
      withAppContext(
        <MapSelect parent={parent} meta={meta} handler={() => ({ value })} />
      )
    )

    await findByTestId('mapSelect')

    expect(parent.meta.updateIncident).not.toHaveBeenCalled()

    userEvent.click(container.querySelector(`img[alt="${value[0]}"]`))

    expect(parent.meta.updateIncident).toHaveBeenCalledWith({
      [meta.name]: [value[1]],
    })
  })
})
