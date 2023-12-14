// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useCallback, useState } from 'react'

import { RadioGroup, Radio } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'

import { StyledInfoText, StyledRadioLabel, StyledLabel } from './styled'

const getSelectedOption = (options, value) =>
  options.find(({ key }) => key === value)

const IncidentSplitRadioInput = ({
  className,
  display,
  id,
  initialValue,
  name,
  onChange,
  options,
}) => {
  const [selected, setSelected] = useState(
    getSelectedOption(options, initialValue)
  )

  const onRadioChange = useCallback(
    (event) => {
      setSelected(getSelectedOption(options, event.target.value))
      onChange(event)
    },
    [options, onChange]
  )

  return (
    <div className={className}>
      <StyledLabel htmlFor={name} label={<strong>{display}</strong>} />

      <RadioGroup name={name} data-testid={`incidentSplitRadioInput-${id}`}>
        {options.map(({ key, value }) => (
          <StyledRadioLabel key={key} label={value}>
            <Radio
              checked={key === initialValue}
              id={`${id}-${key}`}
              name={name}
              onChange={onRadioChange}
              value={key}
            />
          </StyledRadioLabel>
        ))}
      </RadioGroup>

      {selected?.info && (
        <StyledInfoText text={`${selected.value}: ${selected.info}`} />
      )}
    </div>
  )
}

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
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

IncidentSplitRadioInput.defaultProps = {
  className: '',
}

export default IncidentSplitRadioInput
