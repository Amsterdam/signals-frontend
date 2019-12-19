import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import CustomInput from './CustomInput';

const CalendarInput = ({ id, label, name, onSelect, selectedDate }) => (
  <Fragment>
    <DatePicker
      autoComplete="off"
      customInput={<CustomInput label={label} id={id} />}
      dateFormat="DD-MM-YYYY"
      locale="nl"
      onSelect={onSelect}
      selected={selectedDate}
    />

    {selectedDate && (
      <input
        value={selectedDate.format('YYYY-MM-DD')}
        name={name}
        readOnly
        type="hidden"
      />
    )}
  </Fragment>
);

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
   * @param {String} dateValue - Date value formatted by Moment
   * @param {Event} event - Object from the event that triggered the callback
   */
  onSelect: PropTypes.func.isRequired,
  /** Date value */
  selectedDate: PropTypes.instanceOf(moment),
};

export default CalendarInput;
