// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { fireEvent, render, screen } from '@testing-library/react'

import { dateToString } from 'shared/services/date-utils'
import { withAppContext } from 'test/utils'

import CalendarInput from '.'

describe('signals/incident-management/components/CalendarInput', () => {
  const id = 'bar'
  const calendarInputProps = {
    id: 'foo',
    label: 'Here be dragons',
    name: 'my_date_field',
    onSelect: jest.fn(),
  }

  it('renders a datepicker component', () => {
    render(withAppContext(<CalendarInput {...calendarInputProps} />))

    expect(
      document.querySelectorAll('[class*=react-datepicker]').length
    ).toBeGreaterThan(0)
  })

  it('renders a CustomInput component', () => {
    render(withAppContext(<CalendarInput {...calendarInputProps} />))

    expect(screen.getByTestId('calendarCustomInputElement')).toBeInTheDocument()
  })

  it('renders the selected date in the input field', () => {
    const { rerender } = render(
      withAppContext(<CalendarInput {...calendarInputProps} />)
    )

    const element = screen.getByTestId('calendarCustomInputElement')
    expect(element.querySelector('input')?.value).toEqual('')

    const selectedDate = new Date()

    rerender(
      withAppContext(
        <CalendarInput {...calendarInputProps} selectedDate={selectedDate} />
      )
    )
    expect(element.querySelector('input')?.value).toEqual(
      dateToString(selectedDate)
    )
  })

  it('should call onSelect', () => {
    const onSelect = jest.fn()

    render(
      withAppContext(
        <CalendarInput {...calendarInputProps} id={id} onSelect={onSelect} />
      )
    )

    const inputElement = screen.getByRole('textbox', {
      name: calendarInputProps.label,
    })

    expect(onSelect).not.toHaveBeenCalled()

    fireEvent.change(inputElement, { target: { value: '18-12-2018' } })

    expect(onSelect).toHaveBeenCalledWith(expect.any(Date), expect.any(Object))
  })
})
