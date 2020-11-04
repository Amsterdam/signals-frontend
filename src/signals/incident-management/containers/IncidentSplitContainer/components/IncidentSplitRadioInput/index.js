import React, { useCallback, useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { RadioGroup, Radio, Label } from '@amsterdam/asc-ui';

import { StyledInfoText, StyledLabel } from '../../styled';

const getSelectedOption = (options, value) => options.find(({ key }) => key === value);

const IncidentSplitRadioInput = ({ id, name, display, options, initialValue, register }) => {
  const [selected, setSelected] = useState(getSelectedOption(options, initialValue));

  const onChange = useCallback(
    event => {
      setSelected(getSelectedOption(options, event.target.value));
    },
    [options]
  );

  return (
    <Fragment>
      <Label htmlFor={name} label={<strong>{display}</strong>} />

      <RadioGroup name={name} data-testid={`incidentSplitRadioInput-${id}`}>
        {options.map(({ key, value }) => (
          <StyledLabel key={key} label={value}>
            <Radio id={`${id}-${key}`} checked={key === initialValue} value={key} ref={register} onChange={onChange} />
          </StyledLabel>
        ))}
      </RadioGroup>

      {selected?.info && <StyledInfoText text={`${selected.value}: ${selected.info}`} />}
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
