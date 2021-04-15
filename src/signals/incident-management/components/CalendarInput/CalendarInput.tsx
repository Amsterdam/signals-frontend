// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { FunctionComponent, SyntheticEvent } from 'react'
import React, { Fragment, useCallback, useRef } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { dateToString } from 'shared/services/date-utils'
import nl from 'date-fns/locale/nl'
import CustomInput from './CustomInput'
import 'react-datepicker/dist/react-datepicker.css'
import styled from 'styled-components'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
registerLocale('nl', nl)

/** This input is focused after a date is selected to enable form submit functionality for this control*/
const SelectedDateInput = styled.input`
  border: 0;
  margin: 0;
  padding: 0;
  width: 0;
  overflow: hidden;
`

interface CalendarInputProps {
  /** HTMLInputElement id attribute; used for referencing with an HTMLLabelElement */
  id: string
  /** HTMLLabelElement text label */
  label: string
  /** HTMLInputElement name attribute value */
  name: string
  /**
   * Date selection callback function
   * @param {String} dateValue - Date value
   * @param {Event} event - Object from the event that triggered the callback
   */
  onSelect: (
    date: Date | [Date, Date] | null,
    event: SyntheticEvent<HTMLInputElement> | undefined
  ) => void
  /** Date value */
  selectedDate?: Date
}

const CalendarInput: FunctionComponent<CalendarInputProps> = ({
  id,
  label,
  name,
  onSelect: onChange,
  selectedDate = null,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const focus = useCallback(() => {
    /* istanbul ignore else */
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Fragment>
      <DatePicker
        autoComplete="off"
        customInput={<CustomInput label={label} id={id} />}
        dateFormat="dd-MM-yyyy"
        id={id}
        locale="nl"
        onChange={onChange}
        onSelect={focus}
        onCalendarClose={focus}
        selected={selectedDate}
      />

      <SelectedDateInput
        data-testid="selectedDate"
        defaultValue={dateToString(selectedDate) as string}
        name={name}
        ref={inputRef}
        tabIndex={-1}
      />
    </Fragment>
  )
}

export default CalendarInput
