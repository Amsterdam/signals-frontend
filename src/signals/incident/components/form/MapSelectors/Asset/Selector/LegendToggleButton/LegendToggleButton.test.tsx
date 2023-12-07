// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import LegendToggleButton from './index'

describe('LegendToggleButton', () => {
  const onClick = jest.fn()

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('handles onClick', () => {
    render(
      withAppContext(
        <LegendToggleButton
          onClick={onClick}
          isOpen={false}
          legendButtonRef={jest.fn()}
        />
      )
    )

    expect(onClick).not.toHaveBeenCalled()

    userEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalled()
  })
})
