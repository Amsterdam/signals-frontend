// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { createRef } from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
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

    expect(screen.getByTestId('addNoteNewNoteButton')).toBeInTheDocument()
    expect(
      screen.queryByTestId('addNoteSaveNoteButton')
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByTestId('addNoteNewNoteButton'))

    expect(screen.getByTestId('addNoteSaveNoteButton')).toBeInTheDocument()
    expect(screen.queryByTestId('addNoteNewNoteButton')).not.toBeInTheDocument()
    expect(screen.getByTestId('addNoteCancelNoteButton')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('addNoteCancelNoteButton'))

    expect(
      screen.queryByTestId('addNoteSaveNoteButton')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('addNoteCancelNoteButton')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('addNoteNewNoteButton')).toBeInTheDocument()
  })

  it('focuses the textarea', () => {
    const { unmount, rerender } = render(withAppContext(<AddNote />))

    // no ref, no focus
    userEvent.click(screen.getByTestId('addNoteNewNoteButton'))
    expect(screen.getByRole('textbox')).not.toHaveFocus()

    unmount()

    // not standalone, no focus
    rerender(withAppContext(<AddNote ref={ref} isStandalone={false} />))
    expect(screen.getByRole('textbox')).not.toHaveFocus()

    unmount()

    // standalone, setting focus on render
    rerender(withAppContext(<AddNote ref={ref} />))
    userEvent.click(screen.getByTestId('addNoteNewNoteButton'))
    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('calls onChange', () => {
    const onChange = jest.fn()

    render(withAppContext(<AddNote onChange={onChange} />))

    expect(onChange).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('addNoteNewNoteButton'))

    userEvent.type(screen.getByRole('textbox'), 'Here be text')

    expect(onChange).toHaveBeenCalledTimes(12)
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'Here be text' }),
      })
    )

    // nothing should happen; onSubmit isn't passed as a prop
    userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))

    expect(onChange).toHaveBeenCalledTimes(12)
  })

  it('calls onSubmit', () => {
    const onSubmit = jest.fn()

    const { rerender } = render(withAppContext(<AddNote onSubmit={onSubmit} />))

    userEvent.click(screen.getByTestId('addNoteNewNoteButton'))
    userEvent.type(screen.getByRole('textbox'), 'Here be text 2')

    expect(onSubmit).not.toHaveBeenCalled()

    userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(
      expect.anything(),
      // the field's value will not be passed, because there is no ref to attach it to
      undefined
    )

    rerender(withAppContext(<AddNote onSubmit={onSubmit} ref={ref} />))

    userEvent.clear(screen.getByRole('textbox'))
    userEvent.type(screen.getByRole('textbox'), 'Here be text 2')
    userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))

    expect(onSubmit).toHaveBeenCalledTimes(2)
    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.anything(),
      'Here be text 2'
    )
  })

  it('hides the form after submit', () => {
    const submitWillNotHide = jest.fn(() => false)

    const { rerender } = render(
      withAppContext(<AddNote onSubmit={submitWillNotHide} />)
    )

    userEvent.click(screen.getByTestId('addNoteNewNoteButton'))
    userEvent.type(screen.getByRole('textbox'), 'Here be text 3')
    userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))

    expect(submitWillNotHide).toHaveBeenCalledTimes(1)

    expect(screen.getByRole('textbox')).toBeInTheDocument()

    const submitWillHide = jest.fn(() => true)

    rerender(withAppContext(<AddNote onSubmit={submitWillHide} />))

    userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))

    expect(submitWillHide).toHaveBeenCalledTimes(1)

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('clears the textarea', () => {
    render(withAppContext(<AddNote />))

    const value = 'Here be a note'

    userEvent.click(screen.getByTestId('addNoteNewNoteButton'))

    const addNoteTextArea = screen.getByRole('textbox') as HTMLTextAreaElement

    userEvent.type(addNoteTextArea, value)

    expect(screen.getByRole('textbox')).not.toBeEmptyDOMElement()

    fireEvent.click(screen.getByTestId('addNoteCancelNoteButton')) // unmounts the component
    userEvent.click(screen.getByTestId('addNoteNewNoteButton'))

    expect(screen.getByRole('textbox')).toBeEmptyDOMElement()
  })

  it('renders the inline version', () => {
    render(withAppContext(<AddNote isStandalone={false} />))

    expect(screen.getByTestId('addNoteText')).toBeInTheDocument()
    expect(screen.queryByTestId('addNoteNewNoteButton')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('addNoteSaveNoteButton')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('addNoteCancelNoteButton')
    ).not.toBeInTheDocument()
  })
})
