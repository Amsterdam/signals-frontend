import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { Select } from '@datapunt/asc-ui';
import InfoText from 'components/InfoText';
import { StyledWrapper } from './styled';

const getDescription = (options, value) => options.find(({ key: currentValue }) => currentValue === value);

const IncidentSplitSelectInput = ({ id, name, display, options, initialValue, register }) => {
  const [selected, setSelected] = useState(getDescription(options, initialValue));

  const onChange = useCallback(
    event => {
      event.preventDefault();
      setSelected(getDescription(options, event.target.value));
    },
    [options]
  );

  return (
    <StyledWrapper>
      <Select
        label={display}
        name={name}
        ref={register}
        data-testid={`incidentSelectInput-${id}`}
        onChange={onChange}
        value={selected.key}
      >
        {options.map(option => (
          <option key={`${id}-${option.key}`} value={option.key}>{option.name}</option>
        ))}
      </Select>

      {selected?.description && <InfoText text={selected.description} />}
    </StyledWrapper>
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
