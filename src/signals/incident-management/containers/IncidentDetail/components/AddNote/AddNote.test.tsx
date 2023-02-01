// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import AddNote from './AddNote'
import { PATCH_TYPE_NOTES } from '../../constants'
import IncidentDetailContext from '../../context'

describe('AddNote', () => {
  it('renders a generic AddNote component', () => {
    render(
      withAppContext(<AddNote maxContentLength={100} onClose={() => {}} />)
    )

    expect(screen.getByTestId('add-note')).toBeInTheDocument()
  })

  it('calls update on AddNote submit', () => {
    const update = jest.fn()
    const maxContentLength = 100

    render(
      withAppContext(
        <IncidentDetailContext.Provider value={{ update }}>
          <AddNote maxContentLength={maxContentLength} onClose={() => {}} />
        </IncidentDetailContext.Provider>
      )
    )

    userEvent.click(screen.getByTestId('add-note-save-note-button'))

    // no content, update is not called
    expect(update).not.toHaveBeenCalled()

    userEvent.type(screen.getByRole('textbox'), '   ')
    userEvent.click(screen.getByTestId('add-note-save-note-button'))

    // empty content, update is not called
    expect(update).not.toHaveBeenCalled()

    userEvent.clear(screen.getByRole('textbox'))
    userEvent.type(
      screen.getByRole('textbox'),
      Array(maxContentLength + 2).join('+')
    )
    userEvent.click(screen.getByTestId('add-note-save-note-button'))

    // content too long, update is not called
    expect(update).not.toHaveBeenCalled()

    const text = 'Hic sunt dracones'
    userEvent.clear(screen.getByRole('textbox'))
    userEvent.type(screen.getByRole('textbox'), text)
    userEvent.click(screen.getByTestId('add-note-save-note-button'))

    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith({
      type: PATCH_TYPE_NOTES,
      patch: { notes: [{ text }] },
    })
  })

  it('calls close on AddNote submit', () => {
    const update = jest.fn()
    const close = jest.fn()
    const maxContentLength = 100

    render(
      withAppContext(
        <IncidentDetailContext.Provider value={{ update }}>
          <AddNote maxContentLength={maxContentLength} onClose={close} />
        </IncidentDetailContext.Provider>
      )
    )

    const text = 'Hic sunt dracones'
    userEvent.clear(screen.getByRole('textbox'))
    userEvent.type(screen.getByRole('textbox'), text)
    userEvent.click(screen.getByTestId('add-note-save-note-button'))

    expect(close).toHaveBeenCalledTimes(1)
  })
})
