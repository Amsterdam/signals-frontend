// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'

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

const importMapSelect = () => {
  let MapSelect
  jest.isolateModules(() => {
    MapSelect = require('.').default
  })
  return MapSelect
}

describe('signals/incident/components/form/MapSelect', () => {
  afterEach(() => {
    configuration.__reset()
  })

  it('should render the map component', () => {
    const MapSelect = importMapSelect()
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

  it('should render the generic map component with featrue flag enabled', () => {
    configuration.featureFlags.useMapSelectGeneric = true
    const MapSelect = importMapSelect()

    render(
      withAppContext(
        <MapSelect parent={parent} meta={meta} handler={handler} />
      )
    )

    expect(screen.queryByTestId('mapSelectGeneric')).toBeInTheDocument()
  })

  it('should render selected item numbers', () => {
    const MapSelect = importMapSelect()
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
      getByText('Het gaat om lamp of lantaarnpaal met nummer: 9673465; 808435')
    ).toBeInTheDocument()
  })

  it('should call parent.meta.updateIncident', async () => {
    const MapSelect = importMapSelect()

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
