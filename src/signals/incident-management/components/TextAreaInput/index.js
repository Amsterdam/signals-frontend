import React from 'react';
import PropTypes from 'prop-types';
import TextArea from 'components/TextArea';

import './style.scss';

const TextAreaInput = props => {
  const {
    name, display, placeholder, rows, maxLength,
  } = props;
  const render = ({ handler, value }) => (
    <div className="text-area-input">
      <div className="mode_input text rij_verplicht">
        <div className="text-area-input__label">
          <label htmlFor={`form${name}`}>{display}</label>
        </div>

        <div className="text-area-input__control">
          <TextArea
            name=""
            id={`form${name}`}
            value=""
            {...handler()}
            placeholder={placeholder}
            rows={rows}
          />
          { maxLength
            && (
              <div className="input-help">
                <span className="text-area-input__counter">
                  {`${value ? value.length : '0'}/${maxLength} tekens` }
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );

  render.defaultProps = {
    touched: false,
    placeholder: '',
    rows: 4,
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    touched: PropTypes.bool,
    value: PropTypes.string,
    maxLength: PropTypes.number,
  };
  return render;
};

export default TextAreaInput;
