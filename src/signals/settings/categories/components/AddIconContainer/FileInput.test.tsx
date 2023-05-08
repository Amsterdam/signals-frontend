// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { render, screen } from '@testing-library/react'

import type { Props } from './FileInput'
import { FileInput } from './FileInput'

const defaultProps: Props = {
  updateErrorUploadIcon: jest.fn(),
}

describe('FileInpt', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render the FileInput', async () => {
    render(<FileInput {...defaultProps} />)
    expect(screen.getByText('Icoon toevoegen')).toBeInTheDocument()
  })
  it('should show example icon when menu is unfolded', async () => {
    render(<FileInput {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Notitie' })).toBeInTheDocument()
  })
  it('should render an Alert and an icon when there is an icon uploaded', async () => {
    render(<FileInput {...defaultProps} />)
  })
  it('should render an errormessage when the wrong type of file is uploaded', async () => {
    render(<FileInput {...defaultProps} />)
  })
  it('should render an errormessage when the icon is too big', async () => {
    render(<FileInput {...defaultProps} />)
  })
  it('should remove the uploaded icon when the delete button is clicked', async () => {
    render(<FileInput {...defaultProps} />)
  })
  it('should show an global errormessage when Opslaan is clicked but there is an error', async () => {
    render(<FileInput {...defaultProps} />)
  })
})
