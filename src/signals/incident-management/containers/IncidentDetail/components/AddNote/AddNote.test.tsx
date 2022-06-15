import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import IncidentDetailContext from '../../context'
import { PATCH_TYPE_NOTES } from '../../constants'
import AddNote from './AddNote'

describe('AddNote', () => {
  it('renders a generic AddNote component', () => {
    render(
      withAppContext(<AddNote maxContentLength={100} onClose={() => {}} />)
    )

    expect(screen.getByTestId('addNote')).toBeInTheDocument()
  })

  it('calls update on AddNote submit', () => {
    const update = jest.fn()
    const close = jest.fn()
    const maxContentLength = 100

    render(
      withAppContext(
        <IncidentDetailContext.Provider value={{ update, close }}>
          <AddNote maxContentLength={maxContentLength} onClose={() => {}} />
        </IncidentDetailContext.Provider>
      )
    )

    userEvent.click(screen.getByTestId('addNoteNewNoteButton'))
    userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))

    // no content, update is not called
    expect(update).not.toHaveBeenCalled()

    userEvent.type(screen.getByRole('textbox'), '   ')
    userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))

    // empty content, update is not called
    expect(update).not.toHaveBeenCalled()

    userEvent.clear(screen.getByRole('textbox'))
    userEvent.type(
      screen.getByRole('textbox'),
      Array(maxContentLength + 2).join('+')
    )
    userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))

    // content too long, update is not called
    expect(update).not.toHaveBeenCalled()

    const text = 'Hic sunt dracones'
    userEvent.clear(screen.getByRole('textbox'))
    userEvent.type(screen.getByRole('textbox'), text)
    userEvent.click(screen.getByTestId('addNoteSaveNoteButton'))

    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith({
      type: PATCH_TYPE_NOTES,
      patch: { notes: [{ text }] },
    })
  })
})
