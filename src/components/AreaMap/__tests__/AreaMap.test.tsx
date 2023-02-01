// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { StatusCode } from 'signals/incident-management/definitions/types'
import { withAppContext } from 'test/utils'
import type { Geography } from 'types/api/geography'

import AreaMap from '..'
import type { AreaMapProps } from '../AreaMap'
import type { Feature } from '../types'

const features: Feature[] = [
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [1, 2],
    },
    properties: {
      created_at: Date.now().toString(),
      id: 1,
      status: {
        state: StatusCode.Gemeld,
        state_display: 'Gemeld',
      },
    },
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [1, 2],
    },
    properties: {
      created_at: Date.now().toString(),
      id: 2,
      status: {
        state: StatusCode.Afgehandeld,
        state_display: 'Afgehandeld',
      },
    },
  },
]

const geoData: Geography = {
  type: 'FeatureCollection',
  features,
}

describe('<AreaMap />', () => {
  let props: AreaMapProps

  beforeEach(() => {
    props = {
      location: {
        stadsdeel: 'west',
        buurt_code: null,
        address: null,
        extra_properties: null,
        geometrie: {
          type: 'Point',
          coordinates: [25, 4],
        },
      },
      onClick: jest.fn(),
      onClose: jest.fn(),
      selectedFeature: features[0],
      geoData,
    }
  })

  it('should render a map', () => {
    render(withAppContext(<AreaMap {...props} />))

    userEvent.click(screen.getByTestId('map-close-button'))

    expect(props.onClose).toHaveBeenCalled()
  })
})
