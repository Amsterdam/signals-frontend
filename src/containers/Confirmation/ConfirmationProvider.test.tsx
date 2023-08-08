// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ConfirmationProvider } from './ConfirmationProvider'
import { useConfirm } from '../../hooks/useConfirm'
import { withAppContext } from '../../test/utils'
import Button from '../../components/Button'

const answer = jest.fn()
const TestButton = () => {
  const { isConfirmed } = useConfirm()

  return (
    <Button
      data-testid="confirmation-test-button"
      onClick={async () => {
        const bool = await isConfirmed('title', 'prompt')
        answer(bool)
      }}
    />
  )
}

describe('ConfirmationProvider', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render children', () => {
    const { queryByTestId } = render(
      <ConfirmationProvider>
        <div data-testid="confirmation-provider-children"></div>
      </ConfirmationProvider>
    )

    expect(queryByTestId('confirmation-provider-children')).not.toBeNull()
  })

  it('should render a modaldialog and click on bevestig', async () => {
    render(
      withAppContext(
        <ConfirmationProvider>
          <TestButton />
        </ConfirmationProvider>
      )
    )

    expect(screen.queryByText('title')).not.toBeInTheDocument()
    expect(screen.queryByText('prompt')).not.toBeInTheDocument()
    expect(answer).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('confirmation-test-button'))
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('prompt')).toBeInTheDocument()
    expect(answer).not.toHaveBeenCalled()

    userEvent.click(screen.getByText('Bevestig'))

    expect(await screen.findByText('title')).not.toBeInTheDocument()
    expect(screen.queryByText('prompt')).not.toBeInTheDocument()
    expect(answer).toHaveBeenCalledWith(true)
  })

  it('should render a modal dialog and click on annuleer', async () => {
    render(
      withAppContext(
        <ConfirmationProvider>
          <TestButton />
        </ConfirmationProvider>
      )
    )

    expect(screen.queryByText('title')).not.toBeInTheDocument()
    expect(screen.queryByText('prompt')).not.toBeInTheDocument()
    expect(answer).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('confirmation-test-button'))
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('prompt')).toBeInTheDocument()
    expect(answer).not.toHaveBeenCalled()

    userEvent.click(screen.getByText('Annuleer'))

    expect(await screen.findByText('title')).not.toBeInTheDocument()
    expect(screen.queryByText('prompt')).not.toBeInTheDocument()
    expect(answer).toHaveBeenCalledWith(false)
  })
})
