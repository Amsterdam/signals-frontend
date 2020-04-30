import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Label from 'components/Label';
import { themeColor, themeSpacing } from '@datapunt/asc-ui';

import './style.scss';

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: ${themeSpacing(8)};
`;

const Info = styled.span`
  color: ${themeColor('tint', 'level5')};
`;

const ValueContainer = styled.div`
  position: relative;
  margin-bottom: ${themeSpacing(3)};
  padding: 0 0 0 ${themeSpacing(9)};
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
      <Wrapper>
        <div className="mode_input text rij_verplicht">
          {display && <Label htmlFor={`form${name}`}>{display}</Label>}

          <div className="invoer">
            {values?.map(({ key, value }) => (
              <ValueContainer key={`${name}-${key}`}>
                <input
                  id={`${name}-${key}`}
                  data-testid={`${name}-${key}`}
                  className="kenmerkradio"
                  {...handler('radio', key)}
                />
                <label htmlFor={`${name}-${key}`}>{value}</label>
              </ValueContainer>
            ))}

            {info && (
              <p>
                <Info>
                  {label}: {info}
                </Info>
              </p>
            )}
          </div>
        </div>
      </Wrapper>
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
