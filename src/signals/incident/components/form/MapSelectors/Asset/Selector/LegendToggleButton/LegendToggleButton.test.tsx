// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import LegendToggleButton from '.'

describe('LegendToggleButton', () => {
  const onClick = jest.fn()

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('handles onClick', () => {
    render(withAppContext(<LegendToggleButton onClick={onClick} />))

    expect(onClick).not.toHaveBeenCalled()

    userEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalled()
  })
})
