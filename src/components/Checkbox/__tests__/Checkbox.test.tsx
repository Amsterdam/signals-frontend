// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import 'jest-styled-components'

import Checkbox from '..'

describe('Checkbox', () => {
  it('should render with the correct styles', () => {
    render(withAppContext(<Checkbox />))

    expect(screen.getByRole('checkbox')).toHaveStyle('margin-left: -4px')
  })
})
