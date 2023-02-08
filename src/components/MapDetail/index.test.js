// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { render } from '@testing-library/react'

import { markerIcon } from 'shared/services/configuration/map-markers'
import { withAppContext } from 'test/utils'

import MapDetail from './index'

describe('<MapDetail />', () => {
  const props = {
    value: {
      geometrie: { coordinates: [4, 42] },
    },
    zoom: 15,
    icon: markerIcon,
  }

  beforeEach(() => {})

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', () => {
    const { container, getByTestId } = render(
      withAppContext(<MapDetail {...props} />)
    )

    // Map
    expect(getByTestId('map-detail')).toBeInTheDocument()

    // Marker
    expect(container.querySelector('.map-marker-select')).toBeInTheDocument()
  })

  it('should not render without value', () => {
    props.value = {}
    const { container, queryByTestId } = render(
      withAppContext(<MapDetail {...props} />)
    )

    // Map
    expect(queryByTestId('map')).not.toBeInTheDocument()

    // Marker
    expect(
      container.querySelector('.map-marker-select')
    ).not.toBeInTheDocument()
  })
})
