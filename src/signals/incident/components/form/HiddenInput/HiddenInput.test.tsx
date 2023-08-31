//SPDX-License-Identifier: MPL-2.0
//Copyright (C) 2021 -2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import type { FormOptions } from 'types/reactive-form'

import HiddenInput from './HiddenInput'
import type { Props } from './HiddenInput'

const meta = {
  name: 'bar',
  value: 'foo',
  updateIncident: jest.fn(),
} as unknown as Props['meta']

const defaultProps: Props = {
  getError: jest.fn(),
  hasError: jest.fn(),
  handler: jest.fn(),
  parent: {
    meta: {
      updateIncident: jest.fn(),
    },
  } as Props['parent'],
  meta: meta,
  validatorsOrOpts: [] as FormOptions,
}

describe('Form component <HiddenInput/>', () => {
  it('should render a hidden input', () => {
    expect(defaultProps.parent.meta.updateIncident).toHaveBeenCalledTimes(0)

    render(<HiddenInput {...defaultProps} />)

    expect(screen.getByTestId('hidden-input')).toBeInTheDocument()
    expect(screen.getByTestId('hidden-input')).toHaveAttribute('id', 'bar')
    expect(screen.getByTestId('hidden-input')).toHaveAttribute('value', 'foo')
    expect(defaultProps.parent.meta.updateIncident).toHaveBeenCalledTimes(1)
  })

  it('should not render a hidden input when params are missing', () => {
    const missingParamsMeta = {
      ...defaultProps.meta,
      value: undefined as unknown as string,
    }

    render(
      withAppContext(<HiddenInput {...defaultProps} meta={missingParamsMeta} />)
    )
    expect(screen.queryByTestId('hidden-input')).not.toBeInTheDocument()
  })
})
