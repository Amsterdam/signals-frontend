// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import ModalDialog from './ModalDialog'

const title = 'foo'
const content = 'bar'
const mockClose = jest.fn()
const renderModal = () => {
  render(
    withAppContext(
      <ModalDialog onClose={mockClose} title={title}>
        {content}
      </ModalDialog>
    )
  )
}

describe('ModalDialog', () => {
  beforeEach(() => {
    mockClose.mockClear()
  })

  it('renders correctly', () => {
    renderModal()

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(screen.getByText(content)).toBeInTheDocument()
  })

  it('handles clicking the close button', () => {
    renderModal()

    userEvent.click(screen.getByRole('button', { description: 'Sluiten' }))

    expect(mockClose).toHaveBeenCalled()
  })

  it('handles pressing the escape button', () => {
    renderModal()

    expect(mockClose).not.toHaveBeenCalled()
    userEvent.keyboard('{escape}')

    expect(mockClose).toHaveBeenCalled()
  })
})
