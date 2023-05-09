// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { Props } from './FileInput'
import { FileInput } from './FileInput'

// const mockFile: File = {
//   name: 'testFile.svg',
//   lastModified: 1683532584202,
//   size: 271,
//   type: 'image/svg+xml',
//   webkitRelativePath: '',
// }

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

  it('should render an Alert and an icon when there is an icon uploaded', async () => {
    render(<FileInput {...defaultProps} />)

    const addButton = screen.getByTestId('file-input-upload')
    userEvent.click(addButton)

    //todo mockFile aan onchange meegeven

    expect(screen.getByText('icon added')).toBeInTheDocument()
    expect(
      screen.getByText('Let op! Er wordt geen back-up van het icoon gemaakt.')
    ).toBeInTheDocument()
    expect(screen.getByText('Icoon wijzigen')).toBeInTheDocument()
  })

  it('should render an errormessage when the wrong type of file is uploaded', async () => {
    // const mockWrongFile: File = {
    //   name: 'testFile.png',
    //   lastModified: 1683532584202,
    //   size: 271,
    //   type: 'image/svg+xml',
    //   webkitRelativePath: '',
    // }
    render(<FileInput {...defaultProps} />)

    const addButton = screen.getByTestId('file-input-upload')
    userEvent.click(addButton)

    //todo mockFile aan onchange meegeven

    expect(
      screen.getByText(
        'Dit is het verkeerde bestandstype. Upload een .svg-bestand.'
      )
    ).toBeInTheDocument()
  })

  it('should render an errormessage when the icon is too big', async () => {
    // const mockTooBigFile: File = {
    //   name: 'testFile.png',
    //   lastModified: 1683532584202,
    //   size: 1000000,
    //   type: 'image/svg+xml',
    //   webkitRelativePath: '',
    // }

    render(<FileInput {...defaultProps} />)

    const addButton = screen.getByTestId('file-input-upload')
    userEvent.click(addButton)

    //todo mockFile aan onchange meegeven

    expect(
      screen.getByText(
        'De afmetingen van het bestand zijn te groot. Maximaal 32px bij 32px.'
      )
    ).toBeInTheDocument()
  })

  it('should remove the uploaded icon when the delete button is clicked', async () => {
    render(<FileInput {...defaultProps} />)

    //ToDo make Inputfile such that an icon has been uploaded

    expect(screen.getByText('Icoon wijzigen')).toBeInTheDocument()

    const deleteButton = screen.getByTestId('delete-icon-button')
    userEvent.click(deleteButton)

    expect(screen.getByText('Icoon toevoegen')).toBeInTheDocument()
  })
})
