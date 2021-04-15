// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import { RadioGroup, Radio } from '@amsterdam/asc-ui'

import { StyledInfoText, StyledRadioLabel, StyledLabel } from '../../styled'

const getSelectedOption = (options, value) =>
  options.find(({ key }) => key === value)

const IncidentSplitRadioInput = ({
  className,
  id,
  name,
  display,
  options,
  initialValue,
  register,
}) => {
  const [selected, setSelected] = useState(
    getSelectedOption(options, initialValue)
  )

  const onChange = useCallback(
    (event) => {
      setSelected(getSelectedOption(options, event.target.value))
    },
    [options]
  )

  return (
    <div className={className}>
      <StyledLabel htmlFor={name} label={<strong>{display}</strong>} />

      <RadioGroup name={name} data-testid={`incidentSplitRadioInput-${id}`}>
        {options.map(({ key, value }) => (
          <StyledRadioLabel key={key} label={value}>
            <Radio
              id={`${id}-${key}`}
              checked={key === initialValue}
              value={key}
              ref={register}
              onChange={onChange}
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
  register: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default IncidentSplitRadioInput
