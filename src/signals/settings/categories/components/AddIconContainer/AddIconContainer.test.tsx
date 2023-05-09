// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { Props } from './AddIconContainer'
import { AddIconContainer } from './AddIconContainer'

const defaultProps: Props = {
  updateErrorUploadIcon: jest.fn(),
}
describe('AddIconContainer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render the AddIconContainer', async () => {
    render(<AddIconContainer {...defaultProps} />)
    expect(
      screen.getByText('Het icoon wordt getoond op de openbare meldingenkaart')
    ).toBeInTheDocument()
  })

  it('should not show example icon when menu is unfolded', async () => {
    render(<AddIconContainer {...defaultProps} />)
    const chevronDown = screen.getByTestId('chevron-down-show-explanation')

    expect(
      screen.getByText(
        'Zorg voor een circel van 32px bij 32px en exporteer als SVG.'
      )
    ).not.toBeInTheDocument()
    expect(screen.getByAltText('example of an icon')).not.toBeInTheDocument()

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
