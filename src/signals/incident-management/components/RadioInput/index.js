import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { RadioGroup, Radio, Label as AscLabel, themeColor, themeSpacing } from '@datapunt/asc-ui';

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: ${themeSpacing(8)};
`;

const Info = styled.p`
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
      <Wrapper>
        <div className="mode_input text rij_verplicht">
          {display && <AscLabel htmlFor={`form${name}`} label={<strong>{display}</strong>} />}

          <RadioGroup name={name}>
            {values?.map(({ key, value }) => (
              <AscLabel key={key} label={value}>
                <Radio
                  defaultChecked={current === key}
                  id={`${name}-${key}`}
                  data-testid={`${name}-${key}`}
                  // className="kenmerkradio"
                  {...handler('radio', key)}
                />
              </AscLabel>
            ))}
          </RadioGroup>

          {info && (
            <Info>
              {label}: {info}
            </Info>
          )}
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
