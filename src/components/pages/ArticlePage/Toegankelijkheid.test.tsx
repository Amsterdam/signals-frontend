// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import Toegankelijkheid from './Toegankelijkheid'

describe('components/Toegankelijkheid', () => {
  it('Renders Toegankelijkheid', () => {
    render(withAppContext(<Toegankelijkheid />))

    expect(
      screen.getByText('Deze verklaring geldt voor de websites:')
    ).toBeInTheDocument()
  })
})
