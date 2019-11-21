/**
*
* RadioInput
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Label from 'components/Label';

import './style.scss';

export const RadioInput = props => {
  const { name, display, values } = props;
  const render = ({ handler }) => (
    <div className="radio-input">
      <div className="mode_input text rij_verplicht">
        <Label htmlFor={`form${name}`}>{display}</Label>

        <div className="radio-input__control invoer">
          {values && values.map(({ key, value }) => (
            <div className="antwoord" key={`${name}-${key}`}>
              <input
                id={`${name}-${key}`}
                data-testid={`${name}-${key}`}
                className="kenmerkradio"
                {...handler('radio', key)}
              />
              <label htmlFor={`${name}-${key}`}>{value}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  render.defaultProps = {
    touched: false,
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
    touched: PropTypes.bool,
  };
  return render;
};


export default RadioInput;
