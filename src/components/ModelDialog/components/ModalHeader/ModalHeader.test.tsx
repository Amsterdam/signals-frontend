// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022-2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import { ModalHeader } from './ModalHeader'

describe('ModalHeader component', () => {
  const title = 'This is a title'
  const onClose = jest.fn()

  it('renders a title and a functioning close button', () => {
    render(withAppContext(<ModalHeader title={title} onClose={onClose} />))

    expect(screen.getByText(title)).toBeInTheDocument()

    userEvent.click(screen.getByTitle('Sluiten'))

    expect(onClose).toHaveBeenCalled()
  })
})
