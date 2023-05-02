// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam,
import { screen, render, fireEvent } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import FileInput from './FileInput'

describe('FileInput', () => {
  it('renders the Attachments component', () => {
    const change = jest.fn()

    render(
      withAppContext(
        <FileInput name="name" onChange={change}>
          label
        </FileInput>
      )
    )

    expect(screen.getByTestId('file-input-upload-button')).toBeInTheDocument()
    expect(screen.getByLabelText(/label/i)).toBeInTheDocument()
  })

  it('handles file upload', () => {
    const change = jest.fn()
    const files = [
      {
        name: 'bloem.jpeg',
        size: 89691,
        type: 'image/jpeg',
      },
    ]

    render(
      withAppContext(
        <FileInput name="name" onChange={change}>
          label
        </FileInput>
      )
    )

    const fileInputElement = screen.getByLabelText(/label/i)

    fireEvent.change(fileInputElement, {
      target: { files },
    })
    expect(change).toHaveBeenCalledWith(files)
  })
})
