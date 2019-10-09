import React from 'react';
import PropTypes from 'prop-types';

import Label from '../Label';

import './style.scss';

const TextAreaInput = (props) => {
  const { name, display, placeholder, rows, maxLength } = props;
  const render = ({ handler, value }) => (
    <div className="text-area-input">
      <div className="mode_input text rij_verplicht">
        <div className="text-area-input__label">
          <Label htmlFor={`form${name}`}>{display}</Label>
        </div>

        <div className="text-area-input__control invoer">
          <textarea
            name=""
            id={`form${name}`}
            value=""
            {...handler()}
            placeholder={placeholder}
            rows={rows}
          />
          { maxLength &&
            <div className="input-help">
              <span className="text-area-input__counter">
                {`${value ? value.length : '0'}/${maxLength} tekens` }
              </span>
            </div>
          }
        </div>
      </div>
    </div>);

  render.defaultProps = {
    touched: false,
    placeholder: '',
    rows: 4
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
    value: PropTypes.string,
    maxLength: PropTypes.number
  };
  return render;
};

export default TextAreaInput;
