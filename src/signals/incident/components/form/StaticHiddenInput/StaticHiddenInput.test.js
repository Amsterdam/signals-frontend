//SPDX-License-Identifier: MPL-2.0
//Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import StaticHiddenInput from './StaticHiddenInput'

describe('Form component <StaticHiddenInput/>', () => {
  const meta = {
    name: 'bar',
    value: 'foo',
    updateIncident: jest.fn(),
  }

  const props = {
    parent: {
      meta: {
        updateIncident: jest.fn(),
      },
    },
    meta: meta,
  }

  describe('rendering', () => {
    it('should render a hidden input with a static value', () => {
      render(
        withAppContext(<StaticHiddenInput {...props} meta={{ ...meta }} />)
      )
      expect(screen.getByTestId('hidden-input')).toBeInTheDocument()
      expect(screen.getByTestId('hidden-input')).toHaveAttribute('id', 'bar')
      expect(screen.getByTestId('hidden-input')).toHaveAttribute('value', 'foo')
    })

    it('should not render a hidden input when params are missing', () => {
      const missingParamsMeta = {
        ...props.meta,
        value: undefined,
      }

      render(
        withAppContext(
          <StaticHiddenInput {...props} meta={missingParamsMeta} />
        )
      )
      expect(screen.queryByTestId('hidden-input')).not.toBeInTheDocument()
    })
  })
})
