import React, { useCallback, useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { RadioGroup, Radio, Label } from '@datapunt/asc-ui';
import InfoText from 'components/InfoText';
import { StyledLabel } from './styled';

const getInfo = (options, value) => options.find(({ key: currentValue }) => currentValue === value);

const IncidentSplitRadioInput = ({ id, name, display, options, initialValue, register }) => {
  const [selected, setSelected] = useState(getInfo(options, initialValue));

  const onChange = useCallback(
    event => {
      event.preventDefault();
      setSelected(getInfo(options, event.target.value));
    },
    [options]
  );

  return (
    <Fragment>
      <Label htmlFor={name} label={<strong>{display}</strong>} />

      <RadioGroup name={name}>
        {options.map(({ key, value }) => (
          <StyledLabel key={key} label={value}>
            <Radio
              checked={key === initialValue}
              id={`${id}-${key}`}
              data-testid={`incidentSplitRadioInput-${id}-${key}`}
              value={key}
              ref={register}
              onChange={onChange}
            />
          </StyledLabel>
        ))}
      </RadioGroup>

      {selected?.info && <InfoText text={`${selected.value}: ${selected.info}`} />}
    </Fragment>
  );
};

IncidentSplitRadioInput.propTypes = {
  id: PropTypes.string.isRequired,
  display: PropTypes.string.isRequired,
  initialValue: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      info: PropTypes.string,
    })
  ).isRequired,
  register: PropTypes.func.isRequired,
};

export default IncidentSplitRadioInput;
