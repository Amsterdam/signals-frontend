// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { createRef } from 'react'

import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import AddNote, { getAddNoteError } from '.'

const ref = createRef<HTMLTextAreaElement>()

describe('getNoteError', () => {
  it('returns a max length error', () => {
    const maxContentLength = 42
    expect(getAddNoteError({ maxContentLength, text: '   ' })).toEqual(
      'De notitie mag niet leeg zijn'
    )
    expect(
      getAddNoteError({
        maxContentLength,
        text: Array(maxContentLength + 2).join('.'),
      })
    ).toEqual(
      `Je hebt meer dan de maximale ${maxContentLength} tekens ingevoerd.`
    )
    expect(
      getAddNoteError({ maxContentLength, text: 'Hic sunt dracones' })
    ).toEqual('')

    expect(
      getAddNoteError({
        maxContentLength,
        text: '   ',
        shouldContainAtLeastOneChar: false,
      })
    ).toEqual('')
  })
})

describe('AddNote', () => {
  it('shows the form ', () => {
    render(withAppContext(<AddNote />))

    expect(screen.getByTestId('add-note-new-note-button')).toBeInTheDocument()
    expect(
      screen.queryByTestId('add-note-save-note-button')
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByTestId('add-note-new-note-button'))

    expect(screen.getByTestId('add-note-save-note-button')).toBeInTheDocument()
    expect(
      screen.queryByTestId('add-note-new-note-button')
    ).not.toBeInTheDocument()
    expect(
      screen.getByTestId('add-note-cancel-note-button')
    ).toBeInTheDocument()

    userEvent.click(screen.getByTestId('add-note-cancel-note-button'))

    expect(
      screen.queryByTestId('add-note-save-note-button')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('add-note-cancel-note-button')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('add-note-new-note-button')).toBeInTheDocument()
  })

  it('focuses the textarea', async () => {
    const { unmount, rerender } = render(withAppContext(<AddNote />))

    // no ref, no focus
    userEvent.click(screen.getByTestId('add-note-new-note-button'))
    expect(screen.getByRole('textbox')).not.toHaveFocus()

    unmount()

    // not standalone, no focus
    rerender(withAppContext(<AddNote ref={ref} isStandalone={false} />))
    expect(screen.getByRole('textbox')).not.toHaveFocus()

    unmount()

    // standalone, setting focus on render
    rerender(withAppContext(<AddNote ref={ref} />))
    userEvent.click(screen.getByTestId('add-note-new-note-button'))

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveFocus()
    })
  })

  it('calls onChange', () => {
    const onChange = jest.fn()

    render(withAppContext(<AddNote onChange={onChange} />))

    expect(onChange).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('add-note-new-note-button'))

    userEvent.type(screen.getByRole('textbox'), 'Here be text')

    expect(onChange).toHaveBeenCalledTimes(12)
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'Here be text' }),
      })
    )

    // nothing should happen; onSubmit isn't passed as a prop
    userEvent.click(screen.getByTestId('add-note-save-note-button'))

    expect(onChange).toHaveBeenCalledTimes(12)
  })

  it('calls onSubmit', () => {
    const onSubmit = jest.fn()

    const { rerender } = render(withAppContext(<AddNote onSubmit={onSubmit} />))

    userEvent.click(screen.getByTestId('add-note-new-note-button'))
    userEvent.type(screen.getByRole('textbox'), 'Here be text 2')

    expect(onSubmit).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('add-note-save-note-button'))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(
      expect.anything(),
      // the field's value will not be passed, because there is no ref to attach it to
      undefined
    )

    rerender(withAppContext(<AddNote onSubmit={onSubmit} ref={ref} />))

    userEvent.clear(screen.getByRole('textbox'))
    userEvent.type(screen.getByRole('textbox'), 'Here be text 2')
    userEvent.click(screen.getByTestId('add-note-save-note-button'))

    expect(onSubmit).toHaveBeenCalledTimes(2)
    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.anything(),
      'Here be text 2'
    )
  })

  it('calls onCancel', () => {
    const onCancel = jest.fn()

    render(withAppContext(<AddNote onCancel={onCancel} />))

    userEvent.click(screen.getByTestId('add-note-new-note-button'))
    userEvent.type(screen.getByRole('textbox'), 'Here be text 2')

    expect(onCancel).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('add-note-cancel-note-button'))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('hides the form after submit', () => {
    const submitWillNotHide = jest.fn(() => false)

    const { rerender } = render(
      withAppContext(<AddNote onSubmit={submitWillNotHide} />)
    )

    userEvent.click(screen.getByTestId('add-note-new-note-button'))
    userEvent.type(screen.getByRole('textbox'), 'Here be text 3')
    userEvent.click(screen.getByTestId('add-note-save-note-button'))

    expect(submitWillNotHide).toHaveBeenCalledTimes(1)

    expect(screen.getByRole('textbox')).toBeInTheDocument()

    const submitWillHide = jest.fn(() => true)

    rerender(withAppContext(<AddNote onSubmit={submitWillHide} />))

    userEvent.click(screen.getByTestId('add-note-save-note-button'))

    expect(submitWillHide).toHaveBeenCalledTimes(1)

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('clears the textarea', () => {
    render(withAppContext(<AddNote />))

    const value = 'Here be a note'

    userEvent.click(screen.getByTestId('add-note-new-note-button'))

    const addNoteTextArea = screen.getByRole('textbox') as HTMLTextAreaElement

    userEvent.type(addNoteTextArea, value)

    expect(screen.getByRole('textbox')).not.toBeEmptyDOMElement()

    fireEvent.click(screen.getByTestId('add-note-cancel-note-button')) // unmounts the component
    userEvent.click(screen.getByTestId('add-note-new-note-button'))

    expect(screen.getByRole('textbox')).toBeEmptyDOMElement()
  })

  it('renders the inline version', () => {
    render(withAppContext(<AddNote isStandalone={false} />))

    expect(screen.getByTestId('add-note-text')).toBeInTheDocument()
    expect(
      screen.queryByTestId('add-note-new-note-button')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('add-note-save-note-button')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('add-note-cancel-note-button')
    ).not.toBeInTheDocument()
  })

  it('renders without toggling', () => {
    render(
      withAppContext(
        <AddNote withToggle={false} onSubmit={() => true} onCancel={() => {}} />
      )
    )

    expect(screen.getByTestId('add-note-text')).toBeInTheDocument()
    expect(
      screen.queryByTestId('add-note-new-note-button')
    ).not.toBeInTheDocument()

    userEvent.type(screen.getByRole('textbox'), 'Here be text 3')
    userEvent.click(screen.getByTestId('add-note-save-note-button'))

    expect(screen.getByTestId('add-note-text')).toBeInTheDocument()
    expect(
      screen.queryByTestId('add-note-new-note-button')
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByTestId('add-note-cancel-note-button'))

    expect(screen.getByTestId('add-note-text')).toBeInTheDocument()
    expect(
      screen.queryByTestId('add-note-new-note-button')
    ).not.toBeInTheDocument()
  })
})
