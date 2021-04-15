// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import RadioInputGroup from '..'

describe('Form component <RadioInput />', () => {
  const props = {
    touched: false,
    meta: {
      name: 'input-field-name',
      placeholder: 'type here',
      label: 'Radio button question',
      values: {
        foo: 'Foo',
        bar: {
          value: 'Bar',
          info: 'A very bar choice',
        },
      },
      isVisible: true,
    },
    parent: {
      meta: {
        incident: {
          'input-field-name': {
            id: 'bar',
          },
        },
        updateIncident: jest.fn(),
      },
    },
    wrapper: jest.fn(),
    handler: () => ({
      value: {
        id: 'bar',
        label: 'Bar',
        info: 'A very bar choice',
      },
    }),
    getError: jest.fn(),
    hasError: jest.fn(),
  }

  describe('rendering', () => {
    it('renders radio fields correctly', () => {
      render(withAppContext(<RadioInputGroup {...props} />))

      expect(screen.getByRole('radiogroup')).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: 'Foo' })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: 'Bar' })).toBeInTheDocument()
    })

    it('renders zero radio fields when values are not supplied', async () => {
      render(
        withAppContext(
          <RadioInputGroup
            {...props}
            meta={{ ...props.meta, values: undefined }}
          />
        )
      )

      expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
      expect(
        screen.queryByRole('radio', { name: 'Foo' })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('radio', { name: 'Bar' })
      ).not.toBeInTheDocument()
    })

    it('renders no radio field when not visible', () => {
      render(
        withAppContext(
          <RadioInputGroup
            {...props}
            meta={{ ...props.meta, isVisible: false }}
          />
        )
      )

      expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
      expect(
        screen.queryByRole('radio', { name: 'Foo' })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('radio', { name: 'Bar' })
      ).not.toBeInTheDocument()
    })

    it('renders info text for currently selected radio button', () => {
      render(withAppContext(<RadioInputGroup {...props} />))

      expect(screen.getByTestId('input-field-name--info')).toHaveTextContent(
        'Bar: A very bar choice'
      )
    })
  })
})
