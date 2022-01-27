import { render, screen, fireEvent } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import userEvent from '@testing-library/user-event'

import AddNote from './AddNote'

describe('AddNote', () => {
  it('renders correctly', () => {
    render(withAppContext(<AddNote />))

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('calls onBlur', () => {
    const onBlur = jest.fn()

    render(withAppContext(<AddNote onBlur={onBlur} />))

    userEvent.type(screen.getByRole('textbox'), ' ')

    fireEvent.blur(screen.getByRole('textbox'))

    expect(onBlur).not.toHaveBeenCalled()

    userEvent.type(screen.getByRole('textbox'), 'Here be text')

    expect(onBlur).not.toHaveBeenCalled()

    fireEvent.blur(screen.getByRole('textbox'))

    expect(onBlur).toHaveBeenCalled()
  })

  it('does not call onBlur on error', () => {
    const onBlur = jest.fn()

    render(withAppContext(<AddNote onBlur={onBlur} maxContentLength={5} />))

    userEvent.type(screen.getByRole('textbox'), 'This text is way too long')

    fireEvent.blur(screen.getByRole('textbox'))

    expect(onBlur).not.toHaveBeenCalled()
  })
})
