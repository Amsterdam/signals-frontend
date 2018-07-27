import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const TextAreaInput = (props) => {
  const { name, display, placeholder, rows } = props;
  const render = ({ handler }) => (<div className="text-area-input">
    <div className="mode_input text rij_verplicht">
      <div className="label">
        <label htmlFor={`form${name}`}>{display}</label>
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
  };
  return render;
};

export default TextAreaInput;
