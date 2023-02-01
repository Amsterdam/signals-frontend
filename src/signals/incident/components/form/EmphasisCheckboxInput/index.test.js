// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import 'jest-styled-components'

import EmphasisCheckboxInput from '.'

describe('EmphasisCheckboxInput', () => {
  it('renders correctly', () => {
    const props = {
      _parent: {},
      meta: {
        isVisible: true,
      },
      handler: () => ({
        value: {
          value: 'foo',
        },
      }),
    }

    const { container } = render(
      withAppContext(<EmphasisCheckboxInput {...props} />)
    )

    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      expect.any(String)
    )
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })
})
