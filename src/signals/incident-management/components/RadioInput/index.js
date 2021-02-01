import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { RadioGroup, Label, themeSpacing } from '@amsterdam/asc-ui';

import InfoText from 'components/InfoText';
import Radio from 'components/RadioButton';

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: ${themeSpacing(6)};
`;

const StyledLabel = styled(Label)`
  align-self: baseline;

  * {
    font-weight: normal
  }
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
          {display && <Label htmlFor={`form${name}`} label={<strong>{display}</strong>} />}

          <RadioGroup name={name}>
            {values?.map(({ key, value }) => (
              <StyledLabel key={key} label={value}>
                <Radio
                  checked={current === key}
                  id={`${name}-${key}`}
                  data-testid={`${name}-${key}`}
                  {...handler('radio', key)}
                />
              </StyledLabel>
            ))}
          </RadioGroup>

          {info && <InfoText text={`${label}: ${info}`} />}
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
