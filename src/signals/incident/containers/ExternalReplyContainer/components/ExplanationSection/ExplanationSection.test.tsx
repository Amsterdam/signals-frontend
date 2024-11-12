// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ExplanationSection from './ExplanationSection'

describe('ExplanationSection', () => {
  const files = [
    {
      description: 'fileDescription1',
      file: 'fileLocation1',
    },
    {
      description: 'fileDescription2',
      file: 'fileLocation2',
    },
  ]

  it('renders the component', () => {
    render(<ExplanationSection title="Foo" text={'Bar\nBaz'} files={files} />)

    expect(screen.getByRole('heading', { name: 'Foo' })).toBeInTheDocument()
    expect(screen.getByText('Bar')).toBeInTheDocument()
    expect(screen.getByText('Baz')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: files[0].description })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: files[1].description })
    ).toBeInTheDocument()
  })

  it('handles clicking an image', () => {
    const selectFileSpy = jest.fn()
    render(
      <ExplanationSection
        title="Foo"
        text={'Bar\nBaz'}
        files={files}
        onSelectFile={selectFileSpy}
      />
    )

    userEvent.click(screen.getByRole('img', { name: files[0].description }))

    expect(selectFileSpy).toHaveBeenCalledWith(files[0])
  })

  it('handles enter key when image is focused', () => {
    const selectFileSpy = jest.fn()
    const file = files[0]

    render(
      <ExplanationSection
        title="Foo"
        text={'Bar\nBaz'}
        files={[file]}
        onSelectFile={selectFileSpy}
      />
    )
    const img = screen.getByRole('img', { name: file.description })

    userEvent.tab()

    expect(img).toHaveFocus()

    userEvent.keyboard('{enter}')

    expect(selectFileSpy).toHaveBeenCalledWith(file)
  })

  it('shows a section with only text', () => {
    render(<ExplanationSection title="Foo" text={'Bar\nBaz'} />)

    const heading = screen.getByRole('heading', { name: 'Foo' })

    expect(heading).toBeInTheDocument()
  })

  it('shows a section with only files', () => {
    render(<ExplanationSection title="Foo" text={null} files={files} />)

    const heading = screen.getByRole('heading', { name: 'Foo' })

    expect(heading).toBeInTheDocument()
  })

  it('does not show when there is no text and files', () => {
    render(<ExplanationSection title="Foo" text={null} />)

    const heading = screen.queryByRole('heading', { name: 'Foo' })

    expect(heading).not.toBeInTheDocument()
  })

  it('does not show when there is no text and only PDF files', () => {
    const pdfFiles = [{ description: 'pdf', file: 'file.pdf' }]

    render(<ExplanationSection title="Foo" text={null} files={pdfFiles} />)

    const heading = screen.queryByRole('heading', { name: 'Foo' })

    expect(heading).not.toBeInTheDocument()
  })

  it('filters out PDF files', () => {
    const filesWithPdf = [
      { description: 'image', file: 'file.jpg' },
      { description: 'pdf', file: 'file.pdf' },
    ]

    render(<ExplanationSection title="Foo" text={null} files={filesWithPdf} />)

    const images = screen.getAllByRole('img')

    expect(images).toHaveLength(1)
  })
})
