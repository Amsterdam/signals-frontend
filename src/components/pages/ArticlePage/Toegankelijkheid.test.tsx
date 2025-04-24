// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import Toegankelijkheidsverklaring from './Toegankelijkheid'

describe('components/Toegankelijkheidsverklaring', () => {
  it('Renders Toegankelijkheidsverklaring', () => {
    render(withAppContext(<Toegankelijkheidsverklaring />))

    expect(
      screen.getByText('Deze verklaring geldt voor de websites:')
    ).toBeInTheDocument()
  })
})
