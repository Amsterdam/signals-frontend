// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import ModalDialog from './ModalDialog'

const title = 'foo'
const content = 'bar'
const open = true
const isConfirmation = true
const mockClose = jest.fn()
const mockConfirm = jest.fn()
const renderModal = () => {
  render(
    withAppContext(
      <ModalDialog
        open={open}
        onClose={mockClose}
        title={title}
        onConfirm={mockConfirm}
        isConfirmation={isConfirmation}
      >
        {content}
      </ModalDialog>
    )
  )
}

describe('ModalDialog', () => {
  beforeEach(() => {
    mockClose.mockClear()
  })

  it('renders correctly when a confirmation dialog', () => {
    renderModal()

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(screen.getByText(content)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Annuleer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bevestig' })).toBeInTheDocument()
  })

  it('renders not a modal dialog when open is false', () => {
    const open = false
    render(
      withAppContext(
        <ModalDialog
          open={open}
          onClose={mockClose}
          title={title}
          onConfirm={mockConfirm}
          isConfirmation={isConfirmation}
        >
          {content}
        </ModalDialog>
      )
    )

    expect(screen.queryByTestId('modal-dialog')).not.toBeInTheDocument()
  })

  it('handles clicking the close button', () => {
    renderModal()

    userEvent.click(screen.getByRole('button', { name: 'Annuleer' }))

    expect(mockClose).toHaveBeenCalled()
  })

  it('handles pressing the escape button', () => {
    renderModal()

    expect(mockClose).not.toHaveBeenCalled()
    userEvent.keyboard('{escape}')

    expect(mockClose).toHaveBeenCalled()
  })
  it('renders correctly when just a dialog', () => {
    const isConfirmation = false
    render(
      withAppContext(
        <ModalDialog
          open={open}
          onClose={mockClose}
          title={title}
          onConfirm={mockConfirm}
          isConfirmation={isConfirmation}
        >
          {content}
        </ModalDialog>
      )
    )

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(screen.getByText(content)).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Annuleer' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Bevestig' })
    ).not.toBeInTheDocument()
  })
})
