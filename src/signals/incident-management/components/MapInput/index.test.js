// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { render } from '@testing-library/react'

import { withMapContext } from 'test/utils'

import MapInput from '.'

describe('<MapInput />', () => {
  let props

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      handler: jest.fn().mockImplementation(() => ({
        value: {
          id: 5,
          stadsdeel: 'A',
          buurt_code: 'A00c',
          address: {
            postcode: '1012BL',
            huisletter: 'B',
            huisnummer: '84',
            woonplaats: 'Amsterdam',
            openbare_ruimte: 'Geldersekade',
            huisnummer_toevoeging: '',
          },
          address_text: 'Geldersekade 84B- 1012BL Amsterdam',
          geometrie: {
            type: 'Point',
            coordinates: [52.374231891648414, 4.901061058044434],
          },
          extra_properties: null,
        },
      })),
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', () => {
    const { queryByTestId } = render(withMapContext(<MapInput {...props} />))

    expect(queryByTestId('map-input')).toBeInTheDocument()
    expect(queryByTestId('auto-suggest')).toBeInTheDocument()
  })
})
