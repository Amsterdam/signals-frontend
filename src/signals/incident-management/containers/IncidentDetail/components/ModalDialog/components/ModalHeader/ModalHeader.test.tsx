// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import ModalHeader from './ModalHeader'

describe('StatusForm ModalHeader component', () => {
  const title = 'This is a title'
  const onClose = jest.fn()

  it('renders a title and a close button', () => {
    render(withAppContext(<ModalHeader title={title} onClose={onClose} />))

    expect(screen.getByText(title)).toBeInTheDocument()

    userEvent.click(screen.getByTitle('Sluiten'))

    expect(onClose).toHaveBeenCalled()
  })

  it('does not render a close button when onClose is not present', () => {
    render(withAppContext(<ModalHeader title={title} />))

    expect(screen.queryByTitle('Sluiten')).not.toBeInTheDocument()
  })
})
