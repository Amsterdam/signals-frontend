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

    expect(screen.getByTestId('fileInputUploadButton')).toBeInTheDocument()
    expect(screen.getByLabelText(/label/i)).toBeInTheDocument()
  })

  it('hanles file upload', () => {
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
