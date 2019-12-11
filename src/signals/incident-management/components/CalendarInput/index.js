import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import CustomInput from './CustomInput';

const CalendarInput = ({
  defaultValue,
  id,
  label,
  name,
  onChange,
  selectedDate,
}) => (
  <Fragment>
    <DatePicker
      autoComplete="off"
      id={id}
      onChange={onChange}
      selected={selectedDate}
      customInput={<CustomInput label={label} id={id} />}
    />

    {defaultValue && (
      <input value={defaultValue} name={name} readOnly type="hidden" />
    )}
  </Fragment>
);

CalendarInput.defaultProps = {
  defaultValue: null,
  label: '',
  onChange: null,
  selectedDate: null,
};

CalendarInput.propTypes = {
  defaultValue: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  selectedDate: PropTypes.objectOf(moment),
};

export default CalendarInput;
