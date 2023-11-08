// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Accordion } from './Accordion'

describe('Accordion', () => {
  const mockOnToggle = jest.fn()
  const props = {
    id: 'testId',
    title: 'Test Title',
    count: 5,
    onToggle: mockOnToggle,
    children: <div>Test Content</div>,
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render title and count', () => {
    render(<Accordion {...props} />)

    expect(screen.getByText(/Test Title/)).toBeInTheDocument()
    expect(screen.getByText(/(5)/)).toBeInTheDocument()
  })

  it('should not render count', () => {
    render(<Accordion {...props} count="" />)
    expect(screen.getByText(/Test Title/)).toBeInTheDocument()
    expect(screen.queryByText(/(5)/)).not.toBeInTheDocument()
  })

  it('should call onToggle and render children when button is clicked', () => {
    render(<Accordion {...props} />)

    userEvent.click(screen.getByText(/Test Title/))
    expect(mockOnToggle).toHaveBeenCalledWith(true)
    expect(screen.getByText(/Test Content/)).toBeInTheDocument()
  })

  it('should toggle open state when button is clicked twice', () => {
    render(<Accordion {...props} />)

    const button = screen.getByText(/Test Title/)
    userEvent.click(button)
    userEvent.click(button)
    expect(mockOnToggle).toHaveBeenCalledWith(false)
  })
})
