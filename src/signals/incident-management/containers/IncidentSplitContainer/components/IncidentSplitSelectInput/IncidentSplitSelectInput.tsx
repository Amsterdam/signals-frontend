// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useCallback, useState } from 'react'
import type { FC } from 'react'

import type { Group } from 'components/Select'
import Select from 'components/Select'
import type { SubCategoryOption } from 'models/categories/selectors'

import { StyledInfoText, StyledSelect } from '../../styled'

interface IncidentSplitSelectInputProps {
  id: string
  display: string
  initialValue: string
  name: string
  options: Array<SubCategoryOption>
  groups?: Array<Group>
  onChange: (...event: any[]) => void
}

const getSelectedOption = (options: Array<SubCategoryOption>, value: string) =>
  options.find((item) => item.key === value)

const IncidentSplitSelectInput: FC<IncidentSplitSelectInputProps> = ({
  display,
  groups,
  id,
  initialValue,
  name,
  onChange,
  options,
}) => {
  const [selected, setSelected] = useState(
    getSelectedOption(options, initialValue)
  )

  const onSelectChange = useCallback(
    (event) => {
      event.preventDefault()
      setSelected(getSelectedOption(options, event.target.value))
      onChange(event)
    },
    [options, onChange]
  )

  return (
    <StyledSelect>
      <Select
        data-testid={id}
        groups={groups}
        id={name}
        label={<strong>{display}</strong>}
        name={name}
        options={options}
        optionValue="key"
        onChange={onSelectChange}
      />

      {selected?.description && <StyledInfoText text={selected.description} />}
    </StyledSelect>
  )
}

export default IncidentSplitSelectInput
