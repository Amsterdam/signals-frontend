// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StatusCode } from 'signals/incident-management/definitions/statusList'
import { withAppContext } from 'test/utils'

import AreaMap from '..'
import { AreaMapProps } from '../AreaMap'
import { AreaFeature } from '../types'

const features: AreaFeature[] = [
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

describe('<AreaMap />', () => {
  let props: AreaMapProps

  beforeEach(() => {
    props = {
      center: [1, 2],
      onClick: jest.fn(),
      onClose: jest.fn(),
      selectedFeature: features[0],
      geoData: {
        type: 'FeatureCollection',
        features,
      },
    }
  })

  it('should render a map', () => {
    render(withAppContext(<AreaMap {...props} />))

    userEvent.click(screen.getByTestId('mapCloseButton'))

    expect(props.onClose).toHaveBeenCalled()
  })
})
