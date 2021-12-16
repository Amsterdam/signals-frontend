// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import MapInput from '..'

describe('Form component <MapInput />', () => {
  const props = {
    handler: jest.fn() as any,
    meta: {
      name: 'foo',
      isVisible: true,
    },
    touched: false,
    getError: jest.fn(),
    hasError: jest.fn(),
    parent: {
      meta: {
        updateIncident: jest.fn(),
      },
    },
  }

  describe('rendering', () => {
    it('should render map input correctly', () => {
      render(withAppContext(<MapInput {...props} />))

      expect(screen.getByTestId('mapInput')).toBeInTheDocument()
    })

    it('should render no map input when not visible', () => {
      const notVisibleMeta = {
        ...props.meta,
        isVisible: false,
      }
      render(withAppContext(<MapInput {...props} meta={notVisibleMeta} />))

      expect(screen.queryByTestId('mapInput')).not.toBeInTheDocument()
    })

    it('should handle form value', async () => {
      const value = {
        coordinates: { lat: 2.3568, lng: 4.8643 },
        address: {
          openbare_ruimte: 'Straat',
          huisnummer: '1',
          postcode: '1234AB',
          woonplaats: 'Amsterdam',
        },
        addressText: 'Straat 1, 1234AB Amsterdam',
      }
      render(withAppContext(<MapInput {...props} value={value} />))

      const textbox = await screen.findByRole('textbox')

      expect(screen.getByRole('img')).toHaveClass('map-marker-select')
      expect(textbox).toHaveValue(value.addressText)
    })
  })
})
