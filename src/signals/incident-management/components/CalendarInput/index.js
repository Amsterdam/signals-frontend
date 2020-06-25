import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import DatePicker, { registerLocale } from 'react-datepicker';
import { dateToString } from 'shared/services/date-utils';
import nl from 'date-fns/locale/nl';
import CustomInput from './CustomInput';
registerLocale('nl', nl);

const CalendarInput = ({ id, label, name, onSelect, selectedDate }) => (
  <Fragment>
    <DatePicker
      autoComplete="off"
      customInput={<CustomInput label={label} id={id} />}
      dateFormat="dd-MM-yyyy"
      id={id}
      locale="nl"
      onChange={onSelect}
      selected={selectedDate}
    />

    {selectedDate && (
      <input
        value={dateToString(selectedDate)}
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
   * @param {String} dateValue - Date value
   * @param {Event} event - Object from the event that triggered the callback
   */
  onSelect: PropTypes.func.isRequired,
  /** Date value */
  selectedDate: PropTypes.instanceOf(Date),
};

export default CalendarInput;
