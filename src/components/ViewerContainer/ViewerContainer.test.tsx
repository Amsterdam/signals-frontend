// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import ViewerContainer from '.'

describe('ViewerContainer', () => {
  const button = <button type="button">Legend</button>

  it('renders correctly', () => {
    render(withAppContext(<ViewerContainer topLeft={button} />))

    expect(screen.getByRole('button', { name: 'Legend' })).toBeInTheDocument()
  })
})
