import React from 'react';
import PropTypes from 'prop-types';
import TextArea from 'components/TextArea';

import Label from 'components/Label';

import './style.scss';

const TextAreaInput = props => {
  const { name, display, placeholder, rows, maxLength } = props;
  const render = ({ handler, value }) => (
    <div className="text-area-input">
      <div className="mode_input text rij_verplicht">
        <Label htmlFor={`form${name}`}>{display}</Label>

        <div className="text-area-input__control">
          <TextArea
            id={`form${name}`}
            name={name}
            data-testid={name}
            value=""
            {...handler()}
            placeholder={placeholder}
            rows={rows}
            infoText={maxLength > 0 && `${value ? value.length : '0'}/${maxLength} tekens`}
          />
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
