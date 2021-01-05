import React, { Fragment, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DatePicker, { registerLocale } from 'react-datepicker';
import { dateToString } from 'shared/services/date-utils';
import nl from 'date-fns/locale/nl';
import CustomInput from './CustomInput';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
registerLocale('nl', nl);

/** This input is focused after a date is selected to enable form submit functionality for this control*/
const SelectedDateInput = styled.input`
  border: 0;
  margin: 0;
  padding: 0;
  width: 0;
  overflow: hidden;
`;

const CalendarInput = ({ id, label, name, onSelect, selectedDate }) => {
  const inputRef = useRef(null);

  const handleChange = useCallback(
    event => {
      onSelect(event);
    },
    [onSelect]
  );

  const focus = useCallback(() => {
    inputRef.current.focus();
  }, [inputRef]);

  return (
    <Fragment>
      <DatePicker
        autoComplete="off"
        customInput={<CustomInput label={label} id={id} />}
        dateFormat="dd-MM-yyyy"
        id={id}
        locale="nl"
        onChange={handleChange}
        onSelect={focus}
        onCalendarClose={focus}
        selected={selectedDate}
      />

      <SelectedDateInput
        data-testid="selectedDate"
        defaultValue={dateToString(selectedDate)}
        name={name}
        ref={inputRef}
        tabIndex={-1}
      />
    </Fragment>
  );
};

CalendarInput.defaultProps = {
  selectedDate: null,
};

CalendarInput.propTypes = {
  /** HTMLInputElement id attribute; used for referencing with an HTMLLabelElement */
  id: PropTypes.string.isRequired,
  /** HTMLLabelElement text label */
  label: PropTypes.string.isRequired,
  /** HTMLInputElement name attribute value */
  name: PropTypes.string.isRequired,
  /**
   * Date selection callback function
   * @param {String} dateValue - Date value
   * @param {Event} event - Object from the event that triggered the callback
   */
  onSelect: PropTypes.func.isRequired,
  /** Date value */
  selectedDate: PropTypes.instanceOf(Date),
};

export default CalendarInput;
