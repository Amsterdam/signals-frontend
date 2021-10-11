// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import Select from 'components/Select'

import { StyledInfoText, StyledSelect } from '../../styled'

const getSelectedOption = (options, value) =>
  options.find((item) => item.key === value)

const IncidentSplitSelectInput = ({
  id,
  name,
  display,
  options,
  groups = null,
  initialValue,
  register,
}) => {
  const [selected, setSelected] = useState(
    getSelectedOption(options, initialValue)
  )

  const onChange = useCallback(
    (event) => {
      event.preventDefault()
      setSelected(getSelectedOption(options, event.target.value))
    },
    [options]
  )

  return (
    <StyledSelect>
      <Select
        id={name}
        label={<strong>{display}</strong>}
        name={name}
        ref={register}
        data-testid={`${id}`}
        onChange={onChange}
        value={selected?.key}
        optionValue="key"
        options={options}
        groups={groups}
      />

      {selected?.description && <StyledInfoText text={selected.description} />}
    </StyledSelect>
  )
}

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
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  register: PropTypes.func.isRequired,
}

export default IncidentSplitSelectInput
