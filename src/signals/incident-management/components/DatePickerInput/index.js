import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import Label from '../Label';

import './style.scss';

export const DatePickerInput = (props) => {
  const { name, display } = props;

  const render = (theseProps) => {
    const { handler, setValue, value } = theseProps;
    const selectedValue = value ? moment(value) : null;
    return (
      <div className="date-picker-input">
        <div className="mode_input text rij_verplicht">
          <div className="date-picker-input__label">
            <Label htmlFor={`form${name}`}>{display}</Label>
          </div>

          <div className="date-picker-input__control invoer">
            <DatePicker
              dateFormat="dd-MM-yyyy"
              isClearable
              selected={selectedValue}
              {...handler()}
              onChange={((momentValue) => {
                if (momentValue) setValue(moment(momentValue).format('YYYY-MM-DD'));
                else setValue('');
              })}
            />
          </div>
        </div>
      </div>)
      ;
  };

  render.defaultProps = {
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    value: PropTypes.object
  };
  return render;
};

export default DatePickerInput;
