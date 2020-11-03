import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { Select } from '@amsterdam/asc-ui';

import { StyledInfoText, StyledSelect } from '../../styled';

const getSelectedOption = (options, value) => options.find(({ key }) => key === value);

const IncidentSplitSelectInput = ({ id, name, display, options, initialValue, register }) => {
  const [selected, setSelected] = useState(getSelectedOption(options, initialValue));

  const onChange = useCallback(
    event => {
      event.preventDefault();
      setSelected(getSelectedOption(options, event.target.value));
    },
    [options]
  );

  return (
    <StyledSelect>
      <Select
        label={<strong>{display}</strong>}
        name={name}
        ref={register}
        data-testid={`incidentSelectInput-${id}`}
        onChange={onChange}
        value={selected.key}
      >
        {options.map(option => (
          <option key={`${id}-${option.key}`} value={option.key}>{option.value}</option>
        ))}
      </Select>

      {selected?.description && <StyledInfoText text={selected.description} />}
    </StyledSelect>
  );
};

IncidentSplitSelectInput.propTypes = {
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

export default IncidentSplitSelectInput;
