// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'

import { ValidationError } from './ValidationError'
import type { Props } from './ValidationError'

const defaultProps: Props = {
  label: 'The input should be a valid email address',
}

describe('ValidationError', () => {
  it('should render correctly', () => {
    render(<ValidationError {...defaultProps} />)

    expect(
      screen.getByText('The input should be a valid email address')
    ).toBeInTheDocument()
  })
})
