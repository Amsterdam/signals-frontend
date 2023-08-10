// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { render, screen } from '@testing-library/react'

import { ModalContent } from './ModalContent'
import { withAppContext } from '../../../../test/utils'

describe('ModalContent', () => {
  it('renders a bare minimum ModalContent', () => {
    render(withAppContext(<ModalContent />))
    expect(screen.getByTestId('modal-content')).toBeInTheDocument()
  })

  it('renders children', () => {
    const children = 'bar'
    render(withAppContext(<ModalContent> {children}</ModalContent>))
    expect(screen.getByText(children)).toBeInTheDocument()
  })
})
