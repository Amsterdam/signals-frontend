// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import 'jest-styled-components'

import { withAppContext } from 'test/utils'

import CloseButton from './CloseButton'
const mockClose = jest.fn()

const renderWithContext = () =>
  withAppContext(<CloseButton close={mockClose} className="test-class" />)

describe('CloseButton', () => {
  it('is positioned absolute', () => {
    const { container } = render(renderWithContext())

    expect(container.firstChild).toHaveStyleRule('position', 'absolute')
  })
  it('should call the "close" function when clicked', () => {
    render(renderWithContext())

    userEvent.click(screen.getByTestId('close-button'))

    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it('should render with the specified class name', () => {
    render(renderWithContext())

    expect(screen.getByTestId('close-button')).toHaveClass('test-class')
  })
})
