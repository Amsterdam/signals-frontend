// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AddIconExplanation } from './AddIconExplanation'

describe('AddIconContainer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render the AddIconExplanation', async () => {
    render(<AddIconExplanation />)
    expect(
      screen.getByText('Het icoon wordt getoond op de openbare meldingenkaart')
    ).toBeInTheDocument()
  })

  it('should show the example icon when clicked on the chevron down', async () => {
    render(<AddIconExplanation />)
    const chevronDown = screen.getByTestId('chevron-down-show-explanation')

    expect(
      screen.queryByText(
        'Zorg voor een circel van 32px bij 32px en exporteer als SVG.'
      )
    ).not.toBeInTheDocument()
    expect(screen.queryByAltText('example of an icon')).not.toBeInTheDocument()

    userEvent.click(chevronDown)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Zorg voor een circel van 32px bij 32px en exporteer als SVG.'
        )
      ).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByAltText('example of an icon')).toBeInTheDocument()
    })
  })
})
