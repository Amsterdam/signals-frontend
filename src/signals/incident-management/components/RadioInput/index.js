import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Label from 'components/Label';
import { themeColor } from '@datapunt/asc-ui';

import './style.scss';

const Info = styled.span`
  color: ${themeColor('tint', 'level5')};
`;

const RadioInput = ({ name, display, values }) => {
  const Render = ({ handler, value: current }) => {
    let info;
    let label;
    const currentValue = values?.find(({ key }) => key === current);

    if (currentValue) {
      ({ info, value: label } = currentValue);
    }

    return (
      <div className="radio-input">
        <div className="mode_input text rij_verplicht">
          {display && <Label htmlFor={`form${name}`}>{display}</Label>}

          <div className="radio-input__control invoer">
            {values?.map(({ key, value }) => (
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

            <p>
              {info ? (
                <Info>
                  {label}: {info}
                </Info>
              ) : (
                <br />
              )}
            </p>
          </div>
        </div>
      </div>
    );
  };

  Render.defaultProps = {
    touched: false,
  };

  Render.propTypes = {
    handler: PropTypes.func.isRequired,
    value: PropTypes.string,
    touched: PropTypes.bool,
  };

  return Render;
};

export default RadioInput;
