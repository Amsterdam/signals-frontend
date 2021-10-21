// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import { PATCH_TYPE_NOTES } from '../../containers/IncidentDetail/constants'
import IncidentDetailContext from '../../context'
import AddNote from '.'

const update = jest.fn()

const renderWithContext = () =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ update }}>
      <AddNote />
    </IncidentDetailContext.Provider>
  )

describe('<AddNote />', () => {
  beforeEach(() => {
    update.mockReset()
  })

  it('shows the form ', () => {
    render(renderWithContext())

    expect(screen.getByTestId('addNoteNewNoteButton')).toBeInTheDocument()
    expect(
      screen.queryByTestId('addNoteSaveNoteButton')
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('addNoteNewNoteButton'))

    expect(screen.getByTestId('addNoteSaveNoteButton')).toBeInTheDocument()
    expect(screen.queryByTestId('addNoteNewNoteButton')).not.toBeInTheDocument()
    expect(screen.getByTestId('addNoteCancelNoteButton')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('addNoteCancelNoteButton'))

    expect(
      screen.queryByTestId('addNoteSaveNoteButton')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('addNoteCancelNoteButton')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('addNoteNewNoteButton')).toBeInTheDocument()
  })

  it('calls update', () => {
    render(renderWithContext())

    fireEvent.click(screen.getByTestId('addNoteNewNoteButton'))

    const addNoteTextArea = screen.getByTestId('addNoteText')
    const value = 'Here be a note'
    const saveNoteButton = screen.getByTestId('addNoteSaveNoteButton')

    fireEvent.change(addNoteTextArea, { target: { value } })

    expect(update).not.toHaveBeenCalled()

    fireEvent.click(saveNoteButton)

    expect(update).toHaveBeenCalledWith({
      type: PATCH_TYPE_NOTES,
      patch: {
        notes: [{ text: value }],
      },
    })
  })

  it('does not call update when note field is empty', () => {
    render(renderWithContext())

    fireEvent.click(screen.getByTestId('addNoteNewNoteButton'))

    const addNoteTextArea = screen.getByTestId('addNoteText')
    const saveNoteButton = screen.getByTestId('addNoteSaveNoteButton')

    fireEvent.change(addNoteTextArea, { target: { value: '  ' } })

    expect(update).not.toHaveBeenCalled()
    expect(
      screen.queryByText('De notitie kan niet leeg zijn')
    ).not.toBeInTheDocument()

    fireEvent.click(saveNoteButton)

    expect(update).not.toHaveBeenCalled()
    expect(
      screen.getByText('De notitie kan niet leeg zijn')
    ).toBeInTheDocument()
  })

  it('does not call update when context is missing its update action', () => {
    render(
      withAppContext(
        <IncidentDetailContext.Provider value={{}}>
          <AddNote />
        </IncidentDetailContext.Provider>
      )
    )

    fireEvent.click(screen.getByRole('button'))

    userEvent.type(screen.getByRole('textbox'), 'Here be text')

    fireEvent.click(screen.getByTestId('addNoteSaveNoteButton'))

    expect(update).not.toHaveBeenCalled()
  })

  it('clears the textarea', () => {
    render(renderWithContext())
    const value = 'Here be a note'

    fireEvent.click(screen.getByTestId('addNoteNewNoteButton'))

    const addNoteTextArea = screen.getByTestId(
      'addNoteText'
    ) as HTMLTextAreaElement

    expect(addNoteTextArea.value).toEqual('')

    const saveNoteButton = screen.getByTestId('addNoteSaveNoteButton')

    fireEvent.change(addNoteTextArea, { target: { value } })

    expect(addNoteTextArea.value).toEqual(value)

    fireEvent.click(saveNoteButton)

    const newNoteButton = screen.getByTestId('addNoteNewNoteButton')

    fireEvent.click(newNoteButton)

    expect(
      (screen.getByTestId('addNoteText') as HTMLTextAreaElement).value
    ).toEqual('')
  })

  it('shows the max amount of characters allowed', () => {
    render(renderWithContext())

    fireEvent.click(screen.getByTestId('addNoteNewNoteButton'))

    expect(screen.getByText('0 / 3000 tekens')).toBeInTheDocument()

    const input = 'Hello World!'
    userEvent.type(screen.getByRole('textbox'), input)

    expect(
      screen.getByText(`${input.length} / 3000 tekens`)
    ).toBeInTheDocument()

    const maxInput = new Array(3001).join('.')
    userEvent.type(screen.getByRole('textbox'), maxInput)

    expect(
      screen.getByText(`${input.length + maxInput.length} / 3000 tekens`)
    ).toBeInTheDocument()

    const saveNoteButton = screen.getByTestId('addNoteSaveNoteButton')

    expect(
      screen.queryByText('Je hebt meer dan de maximale 3000 tekens ingevoerd.')
    ).not.toBeInTheDocument()

    fireEvent.click(saveNoteButton)

    expect(
      screen.getByText('Je hebt meer dan de maximale 3000 tekens ingevoerd.')
    ).toBeInTheDocument()
  })
})
